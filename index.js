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
    console.log(`Input: ${program.output}`);
} else {
    console.log(`Должен быть указан выходной файл`);
    process.exit();
}

const reader = fs.createReadStream(path.resolve(program.input));
const writer = fs.createWriteStream(path.resolve(program.output));


const parser = csv.parse({
    delimiter: ';'
});

const transform = csv.transform((row, cb) => {
    let phone = row[0];
    phone = phone.replace('.', ',').replace(/[\s]{2}/g, ',').replace(/\t/g, ',').split(',');
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
    phone.length > 1 ? console.log(phone) : null;
    result = row.join(';') + EOL;
    cb(null, result);
});

reader.pipe(parser).pipe(transform).pipe(writer);
