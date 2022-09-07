import xml2js from "xml2js";
import fs from "fs";
import translate from "@vitalets/google-translate-api";

import { execYabberInInputFiles, execYabberInFmgFiles } from "./yabber.js";
import { sleepAndLog } from "./utils/sleep.js";

var parser = new xml2js.Parser();

const traslateWords = async (wordsToTranslates) => {
  const translatedWords = [];

  for (let { word, id } of wordsToTranslates) {
    if (word === "%null%") {
      translatedWords.push({ word, id });
    }

    const res = await translate(word, { to: "ru" });

    translatedWords.push({
      word: res.text,
      id: id,
    });
  }

  return translatedWords;
};

const readFile = () => {
  let parsed = null;

  const data = fs.readFileSync("./teste.xml", (err, data) => data);

  parser.parseString(data, (err, result) => {
    const entries = result.fmg.entries.map((item) => item.text);

    parsed = entries[0].map((item) => {
      return { word: item._, id: item.$.id };
    });
  });

  return parsed;
};

const formatTranslation = (words) => {
  const text = words.map(({ word, id }) => {
    return {
      _: word,
      $: { id },
    };
  });

  return {
    compression: "None",
    version: "DarkSouls3",
    bigendian: "False",
    entries: {
      text,
    },
  };
};

const transformInxml = (object) => {
  const builder = new xml2js.Builder({ rootName: "fmg" });

  return builder.buildObject(formatTranslation(object));
};

const init = async () => {
  await execYabberInInputFiles();

  await sleepAndLog(2000, "Waiting to extract input files");

  await execYabberInFmgFiles();

  await sleepAndLog(2000, "Waiting to extrack FMG files");

  // const wordsToTranslates = readFile();

  // const wordsTranslated = await traslateWords(wordsToTranslates);

  // const transformInXML = transformInxml(wordsTranslated);

  // fs.writeFileSync("./testeTranslated.xml", transformInXML);
};

init();

// let obj = [];

// translatedWords.forEach(({ word }) =>
//   obj.push({
//     text: {
//       _: word,
//       $: { id: id },
//     },
//   })
// );

// console.log(obj);

//   var builder = new xml2js.Builder();

//   var xml = builder.buildObject(obj);

//   console.log(xml);
// });

// var obj = [];

// const newJson = {};

// const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// const languages = ["zh-CN", "ps", "mi", "pt"];

// let index = 0;

// const init = async () => {
//   for (const language of languages) {
//     let textToTranslate = newJson;

//     if (index === 0) {
//       textToTranslate = json;
//     }

//     for (const row in textToTranslate) {
//       console.clear();

//       const word = textToTranslate[row];
//       try {
//         const res = await translate(word, { to: language });
//         newJson[row] = res.text;
//         console.log("> ", `${word}: ${res.text}`);

//         await sleep(500);
//       } catch (error) {
//         fs.writeFile("translated.json", JSON.stringify(newJson), (err) => {
//           if (err) return console.log(err);
//           console.log(`> ${language} -> ${word}`);
//           console.log("Arquivo salvo antes de quebrar kkk");
//         });
//       }
//     }

//     fs.writeFile("translated.json", JSON.stringify(newJson), (err) => {
//       if (err) return console.log(err);
//       console.log("Arquivo salvo com sucesso!");
//     });

//     index++;
//   }
// };

// init();
