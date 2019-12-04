function showdata(data){
    let table = `<table class="table">`
    for(let k in data) {
        table += `<tr><td>${k}</td><td>
            <pre>
                ${JSON.stringify(data[k], null, 2)}
            </pre>
        </td></tr>`
    }
    table += "</table>"
    document.getElementById("container").innerHTML = table;
}
fetch("/data").then(x=>x.json()).then(showdata);