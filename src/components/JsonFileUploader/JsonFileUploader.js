
export function JsonFileUploader({callback}) {
    const handleChange = e => {
        try {
            const fileReader = new FileReader();
            fileReader.readAsText(e.target.files[0], "UTF-8");
            fileReader.onload = e => {
                console.log("e.target.result", e.target.result);
                if (callback)callback(JSON.parse(e.target.result));
            };
        } catch (e) {
            console.log("JsonFileUploader Error: ", e);
            if (callback)callback(null);
        }

    };

    return (<input type="file" onChange={handleChange} />
    );

}
