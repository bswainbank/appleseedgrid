<<<<<<< HEAD
<<<<<<< HEAD
//seeder file written by Letty Bedard for the Appleseed Grid Visualization project
=======
=======
>>>>>>> Label change
<<<<<<< HEAD
seed //seeder file written by Letty Bedard for the Appleseed Grid Visualization project
=======
//seeder file written by Letty Bedard for the Appleseed Grid Visualization project
>>>>>>> Initalal AI
<<<<<<< HEAD
>>>>>>> Label change
=======
=======
//seeder file written by Letty Bedard for the Appleseed Grid Visualization project
>>>>>>> First Appleseed
>>>>>>> Label change

//data is expected to be in .tsv files, see readme for details on expected file formatting and naming

require("dotenv").config({ path: __dirname + "/../"});

<<<<<<< HEAD
process.env.NODE_ENV = "seedProduction";
//process.env.NODE_ENV = "development";
=======
// process.env.NODE_ENV = "seedProduction";
process.env.NODE_ENV = "development";
>>>>>>> Initalal AI

const fileLocation = "/../data/";
const year = "2018";
<<<<<<< HEAD
=======
// process.env.NODE_ENV = "seedProduction";
process.env.NODE_ENV = "development";

const fileLocation = "/../data/";
const year = "2018";

>>>>>>> Iniital AI
=======
>>>>>>> Label change
const fs = require("fs");
const parse = require("csv-parse/lib/sync");
const db = require("../models");

let errors = []; 

let data = []; //will be parsed data from file 
let results = []; //will be array of objects from generation data

let co2Data = []; //will be array of ojbects from co2 data
let stateData = []; //will be array of objects from state data
let stateInfo = {}; //will be obj with abbrev:id and fullName:id pairs
let nrgSrcObj = {}; //for storing source:id
let nrgId; //where we will store energy id, new or not

let plantData = []; //will be array of ojbects from plant data
let plantInfo = {}; //will be obj with orisNum:plantId
let generatorData = []; //will be array of objects from generator data


//read and parse generation data
fs.readFile(__dirname + fileLocation + year + "_generation_state.tsv", "utf8", (err, input) => {
  if (err) {
    console.error(err);
    return;
  }

  data = parse(input, {
    columns: true,
    skip_empty_lines: true,
    delimiter: "\t"
  });

  results = data.filter((row) => {
    return ((row["TYPE OF PRODUCER"] === "Total Electric Power Industry") && !(row["ENERGY SOURCE"] === "Total")); //we only want the total industry AND not total of all sources
  });
});

//read and parse state pop data
fs.readFile(__dirname + fileLocation + year + "_state_pop.tsv", "utf8", (err, input) => {
  if (err) {
    console.error(err);
    return;
  }

  stateData = parse(input, {
    columns: true,
    skip_empty_lines: true,
    delimiter: "\t"
  });
});

//read and parse co2 data
fs.readFile(__dirname + fileLocation + year + "_emission_state.tsv", "utf8", (err, input) => {
  if (err) {
    console.error(err);
    return;
  }

  data = parse(input, {
    columns: true,
    skip_empty_lines: true,
    delimiter: "\t"
  });

  co2Data = data.filter((row) => {
    return ((row["Producer Type"] === "Total Electric Power Industry") && !(row["Energy Source"] === "All Sources")); //we only want the total industry AND not total of all sources
  });
});

//read and parse plant data
fs.readFile(__dirname + fileLocation + year + "_plant_all.tsv", "utf8", (err, input) => {
  if (err) {
    console.error(err);
    return;
  }

  plantData = parse(input, {
    columns: true,
    skip_empty_lines: true,
    delimiter: "\t"
  });
});

//read and parse generator data
fs.readFile(__dirname + fileLocation + year + "_generator_test.tsv", "utf8", (err, input) => {
  if (err) {
    console.error(err);
    return;
  }

  data = parse(input, {
    columns: true,
    skip_empty_lines: true,
    delimiter: "\t"
  });

  generatorData = data.filter((row) => {
    //we don't want to get retired plants
    return (!(row["GENSTAT"] === "RE"));
  });
<<<<<<< HEAD
<<<<<<< HEAD
=======

  // console.table(generatorData);
>>>>>>> Iniital AI
=======
>>>>>>> Label change
});

const seedMe = async () => {
  //fill state table first, for linking to others use stateInfo
  for (const { State, Abbrev, Population } of stateData) {
    await db.State.create({
      fullName: State,
      abbrev: Abbrev,
      population: Population
    }).then(({ fullName, abbrev, id }) => {
      stateInfo[abbrev] = id;
      stateInfo[fullName] = id;
    });
  };

  //add energy sources to table as needed, save id for later
  for (const element of results) {
    // console.table(element);
    if (!nrgSrcObj[element["ENERGY SOURCE"]]) {
      await db.EnergySource.create({
        typeName: element["ENERGY SOURCE"]
      }).then(({ id, typeName }) => {
        nrgSrcObj[typeName] = id;
        nrgId = id;
      });
    }
    else {
      nrgId = nrgSrcObj[element["ENERGY SOURCE"]];
    }

    await db.Generation.create({
      //grab first two chars only, catches US - Total
      StateId: stateInfo[element["STATE"].slice(0,2)],
      EnergySourceId: nrgId,
      amount: parseInt(element["GENERATION (Megawatthours)"])
    });  
  }

  //fill co2 emissions table
  for (const row of co2Data) {
    // console.table(row);
    await db.Co2Emissions.create({
      // StateId: stateInfo[element["STATE"].slice(0,2)],
      StateId: stateInfo[row.State.slice(0,2)],
      EnergySourceId: nrgSrcObj[row["Energy Source"]],
      amount: parseInt(row["CO2 (Metric Tons)"])
    });
  }

  //fill plant table, save id for later
  for (const { PSTATABB, PNAME, ORISPL, LAT, LON, PLPRMFL, PLFUELCT, PLNGENAN, PLCO2EQA, PLC2ERTA} of plantData) {    
    await db.Plant.create({
      plantName: PNAME,
      StateId: stateInfo[PSTATABB],
      orisNum: ORISPL,
      latitude: LAT ? LAT : 0.0,
      longitude: LON ? LON : 0,
      primaryFuel: PLPRMFL,
      fuelCategory: PLFUELCT,
      annualGeneration: PLNGENAN ? PLNGENAN : 0,
      annualCO2: PLCO2EQA ? PLCO2EQA : 0,
      annualCO2perMWH: PLC2ERTA ? PLC2ERTA : 0
    }).then(({ orisNum, id }) => {
      plantInfo[orisNum] = id;
    });
  };

  //fill generation table, use id from plantInfo
};

<<<<<<< HEAD
<<<<<<< HEAD
//console.log(db)

=======
>>>>>>> Iniital AI
=======
//console.log(db)

>>>>>>> Label change
db.sequelize.sync({ 
  force: true 
}).then(async function() {
  await seedMe();
  db.sequelize.close();
});
