var express = require('express');
var moment =  require('moment-timezone');
var router = express.Router();
var stringSimilarity = require("string-similarity");
const util = require('util');
const exec = util.promisify(require('child_process').exec);

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

/* RUN BASH COMMANDS */
router.post('/bash', async function (req, res, next) {
    const {
        bash_command
    } = req.body;

    console.log("Executing Command: ", bash_command);
    try {
        const { stdout, stderr } = await exec(bash_command)

        res.send({
            message: "Successful",
            success: true,
            result:  { stdout, stderr }
        });

    } catch (err) {
        console.log("Command Error: ",err);
        res.send({
            message: "Command Execution Failure: "+err.toString(),
            success: false,
            result: null
        });
    }
});

router.post('/generic/:database_name/:collection_name/add', function (req, res, next) {
    const {
        collection_name,
        database_name
    } = req.params;

    const client = req.mongoClient;
    const collection = client.db(database_name).collection(collection_name);

    const insertObj = req.body;
    insertObj._id = ((insertObj._id) ? insertObj._id : new Date().getTime())+"";
    insertObj.ID = insertObj._id;
    insertObj.time = insertObj._id;
    insertObj.last_updated = insertObj._id;

    collection.insertOne(insertObj, function (err, result) {
        if (err) {
            console.log(err);
            res.log_send({
                message: "Error: " + err,
                success: false
            });
        } else {
            res.log_send({
                message: "object added",
                success: true,
                object_id: insertObj._id
            });
        }
    });
});

router.post('/generic/:database_name/:collection_name/get', function (req, res, next) {
    const {
        collection_name,
        database_name
    } = req.params;

    const client = req.mongoClient;
    const collection = client.db(database_name).collection(collection_name);

    let {
        parameters,
        show_only,
        similar,
        reverse,
        includes,
        data_type,
        summation,
        alias,
        ui_alias,
        paginate,
        android_display_options,
        ui_result_json_to_array,
        result_json_to_array,
        render,
        sorter,
        last,
        render_result
    } = req.body;

    const projection = {};

    /*
    if (render_result) show_only = [];

    if (show_only && show_only.length) {
        projection._id = 0;
        show_only.forEach((param) => {
            projection[param] = 1
        });
    }
    */

    const row_obj_modifier = (value) => {
        if (typeof value === "string") {
            return value;
        } else if (typeof value === "number") {
            return value + "";
        } else if (typeof value === "object") {
            return JSON.stringify(value);
        } else if (typeof value === "boolean") {
            return value + "";
        }
    };

    const paginator = (pageNumber, nPerPage) => {
        return {
            limit: nPerPage,
            skip: pageNumber > 0 ? ((pageNumber - 1) * nPerPage) : 0
        }
    };

    let { limit, skip } = paginator((paginate && paginate.page_number!=null)? paginate.page_number: 1, (paginate && paginate.total_rows!=null)? paginate.total_rows: 100);

    if (!sorter) sorter = {};

    if (last) {
        limit = last;
        sorter = {
            time: -1
        }
    }

    collection.find((parameters) ? parameters : {}, { projection, limit, skip }).sort(sorter).toArray(function (err, result) {
        if (err) {
            console.log(err);
            res.log_send({
                message: "Error: " + err,
                success: false,
                result: []
            });
        } else {
            let summation_result = 0;
            if(last){
                result = result.reverse()
            }
            if (reverse) result = result.reverse();

            if ( render_result ) {
                try {
                    result = eval(render_result)(result);
                } catch (e) {
                    console.log("some error in render_result: " + e);
                }
            }

            if ( render && Object.keys(render).length ) {
                try {
                    const render_result = [];

                    result.forEach((row_obj,index) => {

                        Object.keys(render).forEach((data_key) => {
                            row_obj[data_key] = eval(render[data_key])(row_obj[data_key], row_obj, index, result);
                        });

                        render_result.push(row_obj);
                    });

                    result = render_result;
                } catch (e) {
                    console.log("some error in render: " + e);
                }
            }

            if ( includes && Object.keys(includes).length ) {
                try {
                    const incl_result = [];

                    result.forEach((row_obj) => {
                        let match_count = 0;
                        Object.keys(includes).forEach((data_key) => {
                            if (row_obj && row_obj[data_key] && (row_obj_modifier(row_obj[data_key])).includes(includes[data_key])) {
                                match_count++;
                            }
                        });

                        if (match_count === Object.keys(includes).length) {
                            incl_result.push(row_obj)
                        }
                    });

                    result = incl_result;
                } catch (e) {
                    console.log("some error in includes: " + e)
                }
            }

            if ( data_type && Object.keys(data_type).length ) {
                try {
                    const data_type_result = [];

                    result.forEach((row_obj) => {

                        Object.keys(data_type).forEach((data_key) => {
                            if (data_type[data_key] === "string") {
                                row_obj[data_key] = row_obj_modifier(row_obj[data_key]);
                            } else if (data_type[data_key].includes("datetime")) {
                                if(typeof row_obj[data_key] === 'string'){
                                    row_obj[data_key] = row_obj[data_key] * 1;
                                }
                                row_obj[data_key] = moment(row_obj[data_key]).tz(data_type[data_key].split("::")[2]).format(data_type[data_key].split("::")[1]);
                            } else if (data_type[data_key].includes("number")) {
                                row_obj[data_key] = row_obj[data_key] * 1;
                            }
                        });

                        data_type_result.push(row_obj)
                    });

                    result = data_type_result;
                } catch (e) {
                    console.log("some error in data_type: " + e)
                }
            }

            if ( similar && Object.keys(similar).length ) {
                try {
                    result = (!(similar && Object.keys(similar).length)) ? result : result.map((result_items) => {
                        let total_similarity_score = 0;
                        Object.keys(similar).forEach((similar_param) => {
                            total_similarity_score += stringSimilarity.compareTwoStrings(result_items[similar_param], similar[similar_param]);
                        });

                        if (total_similarity_score > 0.4 * Object.keys(similar).length) {
                            result_items.total_similarity_score = total_similarity_score;
                            return result_items;
                        }
                    }).filter((obj) => {
                        return obj
                    })
                } catch (e) {
                  console.log("some error in similar: " + e)
                }
            }

            if ( summation ) {
                try {
                    result.forEach((row_obj) => {
                        summation_result += row_obj[summation]*1;
                    });
                } catch (e) {
                    console.log("some error in summation: " + e)
                }
            }


            /* AFTER THIS POINT NOT ALL PARAMETERS WILL BE AVAILABLE BECAUSE OF SHOW ONLY */
            if ( show_only && show_only.length ) {
                try {
                    const show_only_result = [];

                    result.forEach((row_obj,index) => {
                        const newRow = {};

                        show_only.forEach((data_key) => {
                            newRow[data_key] = row_obj[data_key];
                        });

                        show_only_result.push(newRow);
                    });

                    result = show_only_result;
                } catch (e) {
                    console.log("some error in show_only: " + e);
                }
            }

            /* AFTER THIS POINT NOT ALL PARAMETERS WILL BE WITH THE SAME KEY BECAUSE OF ALIAS AND UI ALIAS */
            let ui_result = [];
            if (android_display_options && Object.keys(android_display_options).length) {
                try {
                    ui_result = JSON.parse(JSON.stringify(result));
                    const android_display_options_result = [];

                    ui_result.forEach((row_obj) => {

                        Object.keys(row_obj).forEach((data_key) => {
                            const temp_row_key_data = row_obj[data_key];
                            delete row_obj[data_key];
                            row_obj[data_key] = {
                                value: temp_row_key_data,
                                view_props: {
                                    ...android_display_options[data_key]
                                }
                            };
                        });

                        android_display_options_result.push(row_obj)
                    });

                    ui_result = android_display_options_result;

                    if (ui_alias && Object.keys(ui_alias).length) {
                        try {
                            const ui_alias_ui_result = [];

                            ui_result.forEach((row_obj) => {

                                Object.keys(ui_alias).forEach((data_key) => {
                                    const temp_row_key_data = row_obj[data_key];
                                    delete row_obj[data_key];
                                    row_obj[ui_alias[data_key]] = temp_row_key_data;
                                });

                                ui_alias_ui_result.push(row_obj)
                            });

                            ui_result = ui_alias_ui_result;
                        } catch (e) {
                            console.log("some error in alias: " + e)
                        }
                    }

                    if (ui_result_json_to_array) {
                        try {
                            const ui_result_json_to_array_result = [];

                            ui_result.forEach((row_obj) => {
                                const row_arr = [];

                                Object.keys(row_obj).forEach((data_key) => {
                                    const temp_row_key_data = {
                                        "key_name": data_key,
                                        "key_data": row_obj[data_key]
                                    };
                                    row_arr.push(temp_row_key_data);
                                });

                                ui_result_json_to_array_result.push(row_arr)
                            });

                            ui_result = ui_result_json_to_array_result;
                        } catch (e) {
                            console.log("some error in alias: " + e)
                        }
                    }



                } catch (e) {
                    console.log("some error in android_display_options: " + e)
                }
            }

            if (alias && Object.keys(alias).length) {
                try {
                    const alias_result = [];

                    result.forEach((row_obj) => {

                        Object.keys(alias).forEach((data_key) => {
                          const temp_row_key_data = row_obj[data_key];
                          delete row_obj[data_key];
                          row_obj[alias[data_key]] = temp_row_key_data;
                        });

                        alias_result.push(row_obj)
                    });

                    result = alias_result;
                } catch (e) {
                    console.log("some error in alias: " + e)
                }
            }

            if (result_json_to_array) {
                try {
                    const result_json_to_array_result = [];

                    result.forEach((row_obj) => {
                        const row_arr = [];

                        Object.keys(row_obj).forEach((data_key) => {
                            const temp_row_key_data = {
                                "key_name": data_key,
                                "key_data": row_obj[data_key]
                            };
                            row_arr.push(temp_row_key_data);
                        });

                        result_json_to_array_result.push(row_arr)
                    });

                    result = result_json_to_array_result;
                } catch (e) {
                    console.log("some error in alias: " + e)
                }
            }

            res.log_send({
                message: "fetched",
                success: true,
                count: result.length,
                summation_result:summation_result,
                result: result,
                ui_result: ui_result
            });
        }
    });
});

router.post('/generic/:database_name/:collection_name/update', function (req, res, next) {
    const {
        collection_name,
        database_name
    } = req.params;

    const client = req.mongoClient;
    const collection = client.db(database_name).collection(collection_name);

    const {
        parameters,
        modification_obj,
        update_obj
    } = req.body;


    if (modification_obj) modification_obj.last_updated = new Date().getTime();
    if (update_obj && !update_obj["$set"]) update_obj["$set"] = { last_updated: new Date().getTime() };

    let appendedMsg = "";
    if (modification_obj && update_obj && Object.keys(update_obj).length) appendedMsg+=" || modification_obj is Not used when update_obj is provided";

    collection.updateOne((parameters) ? parameters : {}, (update_obj && Object.keys(update_obj).length)? { ...update_obj } : { $set: modification_obj }, function (err, result) {
        if (err) {
            console.log(err);
            res.log_send({
                message: "Error: " + err+appendedMsg,
                success: false
            });
        } else {
            res.log_send({
                message: "updated"+appendedMsg,
                success: true
            });
        }
    });

});

router.post('/generic/:database_name/:collection_name/remove', function (req, res, next) {
    const {
        collection_name,
        database_name
    } = req.params;

    const client = req.mongoClient;
    const collection = client.db(database_name).collection(collection_name);

    const {
        parameters
    } = req.body;


    collection.deleteOne(parameters, function (err, obj) {
        if (err) {
            console.log(err);
            res.log_send({
                message: "Error: " + err,
                success: false
            });
        } else {
            res.log_send({
                message: "removed",
                success: true
            });
        }
    });
});

router.post('/generic/:database_name/:collection_name/drop', function (req, res, next) {
    const {
        collection_name,
        database_name
    } = req.params;

    const client = req.mongoClient;
    const collection = client.db(database_name).collection(collection_name);

    collection.drop(function (err, delOK) {
        res.log_send({
            message: "dropped",
            success: true
        });
    });
});

/* SORTER API */
router.post('/generic/functions/sorter', function (req, res, next) {
    const {
        array_to_sort,
        sort_by,
        sort_order
    } = req.body;

    function sortByKey(array, key) {
        return array.sort(function (a, b) {
            var x = a[key];
            var y = b[key];
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
    }

    const sorted_array = sortByKey(array_to_sort, sort_by);

    res.log_send({
        message: "sorted",
        success: true,
        result: (sort_order === "desc") ? sorted_array.reverse() : sorted_array
    });

});

module.exports = router;
