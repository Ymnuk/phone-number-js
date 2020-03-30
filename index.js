const path = require('path');
const fs = require('fs');
const program = require('commander');
const package = require('./package.json');
//const parse = require('csv-parse');
const csv = require('csv');
const EOL = require('os').EOL;

const proceedPhone = require('./ProceedPhone');

program.version(package.version);
program
    .option('-i --input <file>', 'Входной файл')
    .option('-o --output <file>', 'Выходной файл файл')

program.parse(process.argv);

if (program.input) {
    console.log(`Input: ${program.input}`);
} else {
    console.log(`Должен быть указан входной файл`);
    process.exit();
}
if (program.output) {
    console.log(`Output: ${program.output}`);
} else {
    console.log(`Должен быть указан выходной файл`);
    process.exit();
}

const reader = fs.createReadStream(path.resolve(program.input));
const writer = fs.createWriteStream(path.resolve(program.output));


const parser = csv.parse({
    delimiter: ';'
});

parser.on('error', function (err) {
    console.error(err);
});

const transform = csv.transform((row, cb) => {
    while (row.length < 5) {
        row.push('');
    }
    let phone = row[0].trim();
    if (/^\d\s{1,2}\d{3}\s\d{3}\s\d{2}\s\d{2}/.test(phone)) {
        phone = phone.replace(/\s/g, '');
    }
    if (/^\d{3}\s\d{3}\s\d{2}\s\d{2}/.test(phone)) {
        phone = phone.replace(/\s/g, '');
    }
    if (/^(\d{1})\s(\d{2})\s(\d{2})/) {
        //phone = phone.replace(/\s/g, '');
        phone = phone.replace(/^(\d{1})\s(\d{2})\s(\d{2})/, /$1$2$3/);
    }
    phone = phone.replace(/\+7\s+/g, '+7').replace(/\)\s+/g, ')').replace(/\s+(9\d\d)\s+/g, /$1/).replace(/\-\s+/g, '-').replace(/\s+\-/g, '-').replace('.', ',').replace(';', ',').replace(/[\s]{1}/g, ',').replace(/\t/g, ',').split(',');
    if (phone.length > 0) {
        let mobile = false;
        let tmp = phone[0];
        for (let i = 0; i < phone.length; i++) {
            if (!mobile) {
                phone[i] = proceedPhone.prepare(phone[i]);
                if (proceedPhone.isMobile(phone[i])) {
                    row[0] = phone[i];
                    mobile = true;
                }
            }
        }
        row.push(mobile ? '+' : '-');
        if (!mobile) {
            row[0] = proceedPhone.prepare(tmp);
        }
    } else {
        row[0] = '';
    }
    //phone.length > 1 ? console.log(phone) : null;
    result = row.join(';') + EOL;
    //console.log(result);
    cb(null, result);
});

reader.pipe(parser).pipe(transform).pipe(writer);
