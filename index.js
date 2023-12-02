const fs = require("fs");
const inquirer = require('inquirer');

console.log('begining test')
const blockRegex = /^[^\s{}]+{([^{}]+|{([^{}]+|{})+})+}/gm
// compares blocks of css code to understand order. Block would look like this: 'standard-css-label'.
/* 1=first is higher, -1=second is higher, 0=the same */
function compareBlocks(b1, b2){
    let maxLength = Math.max(b1.length, b2.length)
    for(let i=0; i<maxLength; i++){
        if(b1.charCodeAt(i)>b2.charCodeAt(i)){
            return -1
        }else if(b1.charCodeAt(i)<b2.charCodeAt(i)){
            return 1
        }else{
            return 0
        }
    }
}
function mergeSort(arr){
    const copy = Array.from(arr)
    const mid = Math.floor(copy.length/2)
    var front = copy.slice(0, mid)
    var end = copy.slice(mid+1,copy.length-1)
    if(front.length>1){
        front = mergeSort(front)
    }
    if(end.length>1){
        end = mergeSort(end)
    }
    var sortedArr = []
    var f = 0
    var e = 0
    for(let i=0; i<copy.length; i++){
        if(f===front.length||e===end.length){
            break
        }
        switch(compareBlocks(front[f],end[e])){
            case -1:
                sortedArr.push(end[e])
                e++
                break
            case 0:
                sortedArr.push(front[f])
                f++
                break
            case 1:
                sortedArr.push(front[f])
                f++
                break
        }
    }
    if(f!=front.length){
        for(let i=f; i< front.length; i++){
            sortedArr.push(front[i])
        }
    }
    if(e!=end.length){
        for(let i=e; i< end.length; i++){
            sortedArr.push(end[i])
        }
    }
    console.log(sortedArr)
    return sortedArr
}
inquirer.prompt(
    [
        {
            type: 'input',
            name: 'path',
            message: 'Give direct path to CSS file.'
        }
    ]
).then(response=>{
    fs.readFile(response.path, 'utf8', (err, data)=>{
        if(err){
            console.log(err)
            return
        }
        //console.log(typeof data)
        //console.log(data)
        var arr = data.match(blockRegex)
        console.log(arr)
        //console.log(typeof arr)
        var sorted = mergeSort(arr)
        console.log(sorted)
    })
})

