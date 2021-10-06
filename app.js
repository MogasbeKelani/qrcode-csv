import csv from 'csv-parser';
import fs from 'fs';
import json2csv from 'json2csv';

const results = [];
const fileNames = process.argv.splice(2);
const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data={{date}}&size=50x50`;

const encodeJson = (json) => {
    return encodeURIComponent(JSON.stringify(json));
}
const header = (json) => {
    var string = '';
    for(const keys in json){
        string += keys + ','
    }
    return string.slice(0, -1);
}
const body = (list) => {
    var string = '';
    for(const json in list) {
        for(const keys in list[json]){
            string += list[json][keys] + ','
        }
        string += '\n';
    }
    return string.slice(0, -1);
}
try {
    fs.createReadStream(fileNames[0])
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            for(const line in results) {
                const refactoredUrl = apiUrl.replace("{{date}}", encodeJson(results[line]));
                results[line].qrCodeUrl = refactoredUrl;
            }
            var compiledString = header(results[0]) + '\n' + body(results);
            fs.writeFile(fileNames[1], compiledString, function(err) {
                if(err) {
                    return console.log(err);
                }
                console.log("The file was saved here:", fileNames[1]);
            }); 
            
        });
} catch (err) {
    throw err;
}
