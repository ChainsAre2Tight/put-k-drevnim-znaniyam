function get_textarea_content(id) {
    const input_field = document.getElementById(id);
    result = input_field.value

    return result
}

function compare(a, b) {
    return -(a[1].length - b[1].length)
}

function get_list_of_defines(text) {
    let lines = text.split('\n')

    let result = Array()
    for (const line of lines) {
        try {
            // console.log("line:", line)
            let first = line.indexOf(' ')
            let prefix = line.slice(0, first)

            let last = line.indexOf(' ', first + 1)
            // console.log(first, last)


            let transformation = line.slice(first + 1, last)
            let prototype = line.slice(last + 1, line.length)

            if (prefix === '#define') {
                result.push([transformation, prototype])
                // console.log(transformation, prototype)
            }
        } catch (e) {
            continue;
        }
    }
    result.sort(compare)
    console.log(result)


    return result
}

function transform_code(code, transforms) {
    let result = Array()

    for (const line of code.split('\n')) {
        let new_line = line;
        for (const rep of transforms) {
            new_line = new_line.replaceAll(rep[1], rep[0])


            // console.log(rep)
        }
        result.push(new_line);
    }


    return result.join('\n')
}

function print_result(id, code) {
    const output_field = document.getElementById(id);
    output_field.innerText = code;
}


function main() {
//     get contents of define area
    const defines = get_textarea_content('define-input');
    const definesArray = get_list_of_defines(defines)
//     get contents of code area
    const code = get_textarea_content('code-input');
//     transform it
    let result = transform_code(code, definesArray)
//     print it
    print_result('code-output', result)

}