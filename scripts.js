function get_textarea_content(id) {
    const input_field = document.getElementById(id);
    result = input_field.value

    return result
}

function compare(a, b) {
    return -(a[1].length - b[1].length)
}

function anti_compare(a, b) {
    return -(a[0].length - b[0].length)
}

var blacklist = [
    ">>", ">", ";", ">=", "<", "(", ")", "()",
    "<<", "<=", '=', '==', "&", "?", "^",
    "0", "1", "2", "3", "4",
    "5", "6", "7", "8", "9",
]

function smart_extend(arr1, arr2) {
    for (const elem of arr2) {
        let flag = false
        for (const check of arr1) {
            if (elem[1] === check[1]) {
                flag = true
                break
            }
        }
        if (!flag && elem[0] !== 'int') { // TODO find a real cause of the issue
            arr1.push(elem)
            // console.log(elem)
        }
    }
}

function get_list_of_defines(text) {
    let lines = text.split('\n')

    let result = Array()
    for (const line of lines) {
        try {
            // console.log("line:", line)
            let first = line.indexOf(' ')
            let prefix = line.slice(0, first)

            let last = 0;
            let transformation = ''
            let prototype = ''
            if (prefix === '#define') {
                last = line.indexOf(' ', first + 1)
                transformation = line.slice(first + 1, last)
                prototype = line.slice(last + 1, line.length)
            } else if (prefix === 'using') {
                last = line.lastIndexOf("=") + 1
                transformation = line.slice(first + 1, last - 2)
                prototype = line.slice(last + 1, line.length - 1)
            } else {
                continue
            }
            // console.log(first, last)

            if (!blacklist.includes(prototype)) {
                result.push([transformation, prototype])
                // console.log(transformation, " | ", prototype)
            }
        } catch (e) {
            continue;
        }
    }


    return result
}

function transform_code(code, transforms, reverse) {
    let result = Array()

    if (reverse === false) {
        transforms.sort(compare)
    } else if (reverse === true) {
        transforms.sort(anti_compare)
    }
    // console.log(transforms)

    for (const line of code.split('\n')) {
        if (line.includes("#include") || line === '') {
            continue
        }
        let new_line = line;
        for (const rep of transforms) {
            if (reverse === false) {
                new_line = new_line.replaceAll(rep[1], rep[0])
            } else if (reverse === true) {
                new_line = new_line.replaceAll(rep[0], rep[1])
            }


            // console.log(rep)
        }
        result.push(new_line);
    }


    return result.join('\n')
}

function print_result(id, code) {
    const output_field = document.getElementById(id);
    output_field.value = code;
}


function main(r) {
//     get contents of define area
    const defines = get_textarea_content('define-input');
    const definesArray = get_list_of_defines(defines)
//     get contents of code area
    const code = get_textarea_content('code-input');
// decode defines
    const new_defines = transform_code(defines, definesArray, reverse = true)
    const new_definesArray = get_list_of_defines(new_defines)
    smart_extend(definesArray, new_definesArray)
// transform code
    let result = transform_code(code, definesArray, reverse = r)
//     print it
    print_result('code-output', result)

}