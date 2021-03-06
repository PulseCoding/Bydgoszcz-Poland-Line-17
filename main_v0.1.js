// ----------------------------------------------------//
// Se crean las instancias de las librerias a utilizar //
// ----------------------------------------------------//

var modbus = require('jsmodbus');
var fs = require('fs');
var httpClient = require('node-rest-client').Client;
var clientHttp = new httpClient();
//Asignar host, puerto y otros par ametros al cliente Modbus
var client = modbus.client.tcp.complete({
  'host': "192.168.20.18",
  'port': 502,
  'autoReconnect': true,
  'timeout': 60000,
  'logEnabled': true,
  'reconnectTimeout': 30000
}).connect();

var intId, timeStop = 40,
  flagONS1 = 0,
  flagONS2 = 0,
  flagONS3 = 0,
  flagONS4 = 0,
  flagONS5 = 0,
  flagONS6 = 0,
  flagONS7 = 0,
  flagONS8 = 0,
  flagONS9 = 0,
  flagONS10 = 0,
  flagONS11 = 0;
var BottleSorter, ctBottleSorter = 0,
  speedTempBottleSorter = 0,
  secBottleSorter = 0,
  stopCountBottleSorter = 0,
  flagStopBottleSorter = 0,
  flagPrintBottleSorter = 0,
  speedBottleSorter = 0,
  timeBottleSorter = 0;
var actualBottleSorter = 0,
  stateBottleSorter = 0;
var BottleOrientator, ctBottleOrientator = 0,
  speedTempBottleOrientator = 0,
  secBottleOrientator = 0,
  stopCountBottleOrientator = 0,
  flagStopBottleOrientator = 0,
  flagPrintBottleOrientator = 0,
  speedBottleOrientator = 0,
  timeBottleOrientator = 0;
var actualBottleOrientator = 0,
  stateBottleOrientator = 0;
var Fillercapper, ctFillercapper = 0,
  speedTempFillercapper = 0,
  secFillercapper = 0,
  stopCountFillercapper = 0,
  flagStopFillercapper = 0,
  flagPrintFillercapper = 0,
  speedFillercapper = 0,
  timeFillercapper = 0;
var actualFillercapper = 0,
  stateFillercapper = 0;
var CapSorter, ctCapSorter = 0,
  speedTempCapSorter = 0,
  secCapSorter = 0,
  stopCountCapSorter = 0,
  flagStopCapSorter = 0,
  flagPrintCapSorter = 0,
  speedCapSorter = 0,
  timeCapSorter = 0;
var actualCapSorter = 0,
  stateCapSorter = 0;
var Depuck, ctDepuck = 0,
  speedTempDepuck = 0,
  secDepuck = 0,
  stopCountDepuck = 0,
  flagStopDepuck = 0,
  flagPrintDepuck = 0,
  speedDepuck = 0,
  timeDepuck = 0;
var actualDepuck = 0,
  stateDepuck = 0;
var Labeller, ctLabeller = 0,
  speedTempLabeller = 0,
  secLabeller = 0,
  stopCountLabeller = 0,
  flagStopLabeller = 0,
  flagPrintLabeller = 0,
  speedLabeller = 0,
  timeLabeller = 0;
var actualLabeller = 0,
  stateLabeller = 0;
var Shrinkwrapper, ctShrinkwrapper = 0,
  speedTempShrinkwrapper = 0,
  secShrinkwrapper = 0,
  stopCountShrinkwrapper = 0,
  flagStopShrinkwrapper = 0,
  flagPrintShrinkwrapper = 0,
  speedShrinkwrapper = 0,
  timeShrinkwrapper = 0;
var actualShrinkwrapper = 0,
  stateShrinkwrapper = 0;
var _3MTaper, ct_3MTaper = 0,
  speedTemp_3MTaper = 0,
  sec_3MTaper = 0,
  stopCount_3MTaper = 0,
  flagStop_3MTaper = 0,
  flagPrint_3MTaper = 0,
  speed_3MTaper = 0,
  time_3MTaper = 0;
var actual_3MTaper = 0,
  state_3MTaper = 0;
var Printer, ctPrinter = 0,
  speedTempPrinter = 0,
  secPrinter = 0,
  stopCountPrinter = 0,
  flagStopPrinter = 0,
  flagPrintPrinter = 0,
  speedPrinter = 0,
  timePrinter = 0;
var actualPrinter = 0,
  statePrinter = 0;
var Checkweigher, ctCheckweigher = 0,
  speedTempCheckweigher = 0,
  secCheckweigher = 0,
  stopCountCheckweigher = 0,
  flagStopCheckweigher = 0,
  flagPrintCheckweigher = 0,
  speedCheckweigher = 0,
  timeCheckweigher = 0;
var actualCheckweigher = 0,
  stateCheckweigher = 0;
var Paletizer, ctPaletizer = 0,
  speedTempPaletizer = 0,
  secPaletizer = 0,
  stopCountPaletizer = 0,
  flagStopPaletizer = 0,
  flagPrintPaletizer = 0,
  speedPaletizer = 0,
  timePaletizer = 0;
var actualPaletizer = 0,
  statePaletizer = 0;
var Barcode, secBarcode = 0;
var secEOL = 0,
  secPubNub = 4 * 60 + 55;
var publishConfig;

var files = fs.readdirSync("/home/oee/Pulse/BYD_L17_LOGS/"); //Leer documentos

var text2send = []; //Vector a enviar
var flagInfo2Send = 0;
var i = 0;


// --------------------------------------------------------- //
//Función que realiza las instrucciones de lectura de datos  //
// --------------------------------------------------------- //
var DoRead = function() {
  client.readHoldingRegisters(0, 99).then(function(resp) {
    var statesBottleSorter = switchData(resp.register[0], resp.register[1]),
      statesBottleOrientator = switchData(resp.register[2], resp.register[3]),
      statesFillercapper = switchData(resp.register[4], resp.register[5]),
      statesCapSorter = switchData(resp.register[6], resp.register[7]),
      statesDepuck = switchData(resp.register[8], resp.register[9]),
      statesLabeller = switchData(resp.register[10], resp.register[11]),
      statesShrinkwrapper = switchData(resp.register[12], resp.register[13]),
      states_3MTaper = switchData(resp.register[14], resp.register[15]),
      statesCheckweigher = switchData(resp.register[16], resp.register[17]),
      statesPrinter = switchData(resp.register[18], resp.register[19]),
      statesPaletizer = switchData(resp.register[20], resp.register[21]);

    //Barcode -------------------------------------------------------------------------------------------------------------
    if (resp.register[70] == 0 && resp.register[71] == 0 && resp.register[72] == 0 && resp.register[73] == 0 && resp.register[74] == 0 && resp.register[75] == 0 && resp.register[76] == 0 && resp.register[77] == 0) {
      Barcode = '0';
    } else {
      var dig1 = hex2a(assignment(resp.register[70]).toString(16));
      var dig2 = hex2a(assignment(resp.register[71]).toString(16));
      var dig3 = hex2a(assignment(resp.register[72]).toString(16));
      var dig4 = hex2a(assignment(resp.register[73]).toString(16));
      var dig5 = hex2a(assignment(resp.register[74]).toString(16));
      var dig6 = hex2a(assignment(resp.register[75]).toString(16));
      var dig7 = hex2a(assignment(resp.register[76]).toString(16));
      var dig8 = hex2a(assignment(resp.register[77]).toString(16));
      Barcode = dig1 + dig2 + dig3 + dig4 + dig5 + dig6 + dig7 + dig8;
    }
    if (isNaN(Barcode)) {
      Barcode = '0';
    }
    if (secBarcode >= 60) {
      writedataBarcode(Barcode, "pol_byd_Barcode_l17.log");
      secBarcode = 0;
    }
    secBarcode++;
    //Barcode -------------------------------------------------------------------------------------------------------------
    //BottleSorter -------------------------------------------------------------------------------------------------------------
    ctBottleSorter = joinWord(resp.register[23], resp.register[22]);
    if (flagONS1 === 0) {
      speedTempBottleSorter = ctBottleSorter;
      flagONS1 = 1;
    }
    if (secBottleSorter >= 60) {
      if (stopCountBottleSorter === 0 || flagStopBottleSorter == 1) {
        flagPrintBottleSorter = 1;
        secBottleSorter = 0;
        speedBottleSorter = ctBottleSorter - speedTempBottleSorter;
        speedTempBottleSorter = ctBottleSorter;
      }
      if (flagStopBottleSorter == 1) {
        timeBottleSorter = Date.now();
      }
    }
    secBottleSorter++;
    if (ctBottleSorter > actualBottleSorter) {
      stateBottleSorter = 1; //RUN
      if (stopCountBottleSorter >= timeStop) {
        speedBottleSorter = 0;
        secBottleSorter = 0;
      }
      timeBottleSorter = Date.now();
      stopCountBottleSorter = 0;
      flagStopBottleSorter = 0;


    } else if (ctBottleSorter == actualBottleSorter) {
      if (stopCountBottleSorter === 0) {
        timeBottleSorter = Date.now();
      }
      stopCountBottleSorter++;
      if (stopCountBottleSorter >= timeStop) {
        stateBottleSorter = 2; //STOP
        speedBottleSorter = 0;
        if (flagStopBottleSorter === 0) {
          flagPrintBottleSorter = 1;
          ////console.log(stateBottleSorter);
          secBottleSorter = 0;
        }
        flagStopBottleSorter = 1;
      }
    }
    if (stateBottleSorter == 2) {
      speedTempBottleSorter = ctBottleSorter;
    }

    actualBottleSorter = ctBottleSorter;
    if (stateBottleSorter == 2) {
      if (statesBottleSorter[5] == 1) {
        stateBottleSorter = 3; //Wait
      } else {
        if (statesBottleSorter[4] == 1) {
          stateBottleSorter = 4; //Block
        }
      }
    }
    BottleSorter = {
      ST: stateBottleSorter,
      //CPQI: joinWord(resp.register[57],resp.register[56]),
      CPQO: joinWord(resp.register[23], resp.register[22]),
      //CPQR: joinWord(resp.register[23],resp.register[22]),
      SP: speedBottleSorter
    };
    if (flagPrintBottleSorter == 1) {
      for (var key in BottleSorter) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_BottleSorter_l17.log", "tt=" + timeBottleSorter + ",var=" + key + ",val=" + BottleSorter[key] + "\n");
      }
      flagPrintBottleSorter = 0;
    }
    //BottleSorter -------------------------------------------------------------------------------------------------------------
    //BottleOrientator -------------------------------------------------------------------------------------------------------------
    ctBottleOrientator = joinWord(resp.register[25], resp.register[24]);
    if (flagONS2 === 0) {
      speedTempBottleOrientator = ctBottleOrientator;
      flagONS2 = 1;
    }
    if (secBottleOrientator >= 60) {
      if (stopCountBottleOrientator === 0 || flagStopBottleOrientator == 1) {
        flagPrintBottleOrientator = 1;
        secBottleOrientator = 0;
        speedBottleOrientator = ctBottleOrientator - speedTempBottleOrientator;
        speedTempBottleOrientator = ctBottleOrientator;
      }
      if (flagStopBottleOrientator == 1) {
        timeBottleOrientator = Date.now();
      }
    }
    secBottleOrientator++;
    if (ctBottleOrientator > actualBottleOrientator) {
      stateBottleOrientator = 1; //RUN
      if (stopCountBottleOrientator >= timeStop) {
        speedBottleOrientator = 0;
        secBottleOrientator = 0;
      }
      timeBottleOrientator = Date.now();
      stopCountBottleOrientator = 0;
      flagStopBottleOrientator = 0;


    } else if (ctBottleOrientator == actualBottleOrientator) {
      if (stopCountBottleOrientator === 0) {
        timeBottleOrientator = Date.now();
      }
      stopCountBottleOrientator++;
      if (stopCountBottleOrientator >= timeStop) {
        stateBottleOrientator = 2; //STOP
        speedBottleOrientator = 0;
        if (flagStopBottleOrientator === 0) {
          flagPrintBottleOrientator = 1;
          ////console.log(stateBottleOrientator);
          secBottleOrientator = 0;
        }
        flagStopBottleOrientator = 1;
      }
    }
    if (stateBottleOrientator == 2) {
      speedTempBottleOrientator = ctBottleOrientator;
    }

    actualBottleOrientator = ctBottleOrientator;
    if (stateBottleOrientator == 2) {
      if (statesBottleOrientator[5] == 1) {
        stateBottleOrientator = 3; //Wait
      } else {
        if (statesBottleOrientator[4] == 1) {
          stateBottleOrientator = 4; //Block
        }
      }
    }
    BottleOrientator = {
      ST: stateBottleOrientator,
      //CPQI: joinWord(resp.register[57],resp.register[56]),
      CPQO: joinWord(resp.register[25], resp.register[24]),
      //CPQR: joinWord(resp.register[23],resp.register[22]),
      SP: speedBottleOrientator
    };
    if (flagPrintBottleOrientator == 1) {
      for (var key in BottleOrientator) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_BottleOrientator_l17.log", "tt=" + timeBottleOrientator + ",var=" + key + ",val=" + BottleOrientator[key] + "\n");
      }
      flagPrintBottleOrientator = 0;
    }
    //BottleOrientator -------------------------------------------------------------------------------------------------------------
    //Fillercapper -------------------------------------------------------------------------------------------------------------
    ctFillercapper = joinWord(resp.register[27], resp.register[26]);
    if (flagONS3 === 0) {
      speedTempFillercapper = ctFillercapper;
      flagONS3 = 1;
    }
    if (secFillercapper >= 60) {
      if (stopCountFillercapper === 0 || flagStopFillercapper == 1) {
        flagPrintFillercapper = 1;
        secFillercapper = 0;
        speedFillercapper = ctFillercapper - speedTempFillercapper;
        speedTempFillercapper = ctFillercapper;
      }
      if (flagStopFillercapper == 1) {
        timeFillercapper = Date.now();
      }
    }
    secFillercapper++;
    if (ctFillercapper > actualFillercapper) {
      stateFillercapper = 1; //RUN
      if (stopCountFillercapper >= timeStop) {
        speedFillercapper = 0;
        secFillercapper = 0;
      }
      timeFillercapper = Date.now();
      stopCountFillercapper = 0;
      flagStopFillercapper = 0;


    } else if (ctFillercapper == actualFillercapper) {
      if (stopCountFillercapper === 0) {
        timeFillercapper = Date.now();
      }
      stopCountFillercapper++;
      if (stopCountFillercapper >= timeStop) {
        stateFillercapper = 2; //STOP
        speedFillercapper = 0;
        if (flagStopFillercapper === 0) {
          flagPrintFillercapper = 1;
          ////console.log(stateFillercapper);
          secFillercapper = 0;
        }
        flagStopFillercapper = 1;
      }
    }
    if (stateFillercapper == 2) {
      speedTempFillercapper = ctFillercapper;
    }

    actualFillercapper = ctFillercapper;
    if (stateFillercapper == 2) {
      if (statesFillercapper[5] == 1) {
        stateFillercapper = 3; //Wait
      } else {
        if (statesFillercapper[4] == 1) {
          stateFillercapper = 4; //Block
        }
      }
    }
    Fillercapper = {
      ST: stateFillercapper,
      CPQI: joinWord(resp.register[27], resp.register[26]),
      CPQO: joinWord(resp.register[29], resp.register[28]),
      CPQR: joinWord(resp.register[31], resp.register[30]),
      SP: speedFillercapper
    };
    if (flagPrintFillercapper == 1) {
      for (var key in Fillercapper) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_Fillercapper_l17.log", "tt=" + timeFillercapper + ",var=" + key + ",val=" + Fillercapper[key] + "\n");
      }
      flagPrintFillercapper = 0;
    }
    //Fillercapper -------------------------------------------------------------------------------------------------------------
    //CapSorter -------------------------------------------------------------------------------------------------------------
    ctCapSorter = joinWord(resp.register[33], resp.register[32]);
    if (flagONS4 === 0) {
      speedTempCapSorter = ctCapSorter;
      flagONS4 = 1;
    }
    if (secCapSorter >= 60) {
      if (stopCountCapSorter === 0 || flagStopCapSorter == 1) {
        flagPrintCapSorter = 1;
        secCapSorter = 0;
        speedCapSorter = ctCapSorter - speedTempCapSorter;
        speedTempCapSorter = ctCapSorter;
      }
      if (flagStopCapSorter == 1) {
        timeCapSorter = Date.now();
      }
    }
    secCapSorter++;
    if (ctCapSorter > actualCapSorter) {
      stateCapSorter = 1; //RUN
      if (stopCountCapSorter >= timeStop) {
        speedCapSorter = 0;
        secCapSorter = 0;
      }
      timeCapSorter = Date.now();
      stopCountCapSorter = 0;
      flagStopCapSorter = 0;


    } else if (ctCapSorter == actualCapSorter) {
      if (stopCountCapSorter === 0) {
        timeCapSorter = Date.now();
      }
      stopCountCapSorter++;
      if (stopCountCapSorter >= timeStop) {
        stateCapSorter = 2; //STOP
        speedCapSorter = 0;
        if (flagStopCapSorter === 0) {
          flagPrintCapSorter = 1;
          ////console.log(stateCapSorter);
          secCapSorter = 0;
        }
        flagStopCapSorter = 1;
      }
    }
    if (stateCapSorter == 2) {
      speedTempCapSorter = ctCapSorter;
    }

    actualCapSorter = ctCapSorter;
    if (stateCapSorter == 2) {
      if (statesCapSorter[5] == 1) {
        stateCapSorter = 3; //Wait
      } else {
        if (statesCapSorter[4] == 1) {
          stateCapSorter = 4; //Block
        }
      }
    }
    CapSorter = {
      ST: stateCapSorter,
      //CPQI: joinWord(resp.register[27],resp.register[26]),
      CPQO: joinWord(resp.register[33], resp.register[32]),
      //CPQR: joinWord(resp.register[31],resp.register[30]),
      SP: speedCapSorter
    };
    if (flagPrintCapSorter == 1) {
      for (var key in CapSorter) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_CapSorter_l17.log", "tt=" + timeCapSorter + ",var=" + key + ",val=" + CapSorter[key] + "\n");
      }
      flagPrintCapSorter = 0;
    }
    //CapSorter -------------------------------------------------------------------------------------------------------------
    //Depuck -------------------------------------------------------------------------------------------------------------
    ctDepuck = joinWord(resp.register[35], resp.register[34]);
    if (flagONS5 === 0) {
      speedTempDepuck = ctDepuck;
      flagONS5 = 1;
    }
    if (secDepuck >= 60) {
      if (stopCountDepuck === 0 || flagStopDepuck == 1) {
        flagPrintDepuck = 1;
        secDepuck = 0;
        speedDepuck = ctDepuck - speedTempDepuck;
        speedTempDepuck = ctDepuck;
      }
      if (flagStopDepuck == 1) {
        timeDepuck = Date.now();
      }
    }
    secDepuck++;
    if (ctDepuck > actualDepuck) {
      stateDepuck = 1; //RUN
      if (stopCountDepuck >= timeStop) {
        speedDepuck = 0;
        secDepuck = 0;
      }
      timeDepuck = Date.now();
      stopCountDepuck = 0;
      flagStopDepuck = 0;


    } else if (ctDepuck == actualDepuck) {
      if (stopCountDepuck === 0) {
        timeDepuck = Date.now();
      }
      stopCountDepuck++;
      if (stopCountDepuck >= timeStop) {
        stateDepuck = 2; //STOP
        speedDepuck = 0;
        if (flagStopDepuck === 0) {
          flagPrintDepuck = 1;
          ////console.log(stateDepuck);
          secDepuck = 0;
        }
        flagStopDepuck = 1;
      }
    }
    if (stateDepuck == 2) {
      speedTempDepuck = ctDepuck;
    }

    actualDepuck = ctDepuck;
    if (stateDepuck == 2) {
      if (statesDepuck[5] == 1) {
        stateDepuck = 3; //Wait
      } else {
        if (statesDepuck[4] == 1) {
          stateDepuck = 4; //Block
        }
      }
    }
    Depuck = {
      ST: stateDepuck,
      //CPQI: joinWord(resp.register[27],resp.register[26]),
      CPQO: joinWord(resp.register[35], resp.register[34]),
      //CPQR: joinWord(resp.register[31],resp.register[30]),
      SP: speedDepuck
    };
    if (flagPrintDepuck == 1) {
      for (var key in Depuck) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_Depuck_l17.log", "tt=" + timeDepuck + ",var=" + key + ",val=" + Depuck[key] + "\n");
      }
      flagPrintDepuck = 0;
    }
    //Depuck -------------------------------------------------------------------------------------------------------------
    //Labeller -------------------------------------------------------------------------------------------------------------
    ctLabeller = joinWord(resp.register[37], resp.register[36]);
    if (flagONS6 === 0) {
      speedTempLabeller = ctLabeller;
      flagONS6 = 1;
    }
    if (secLabeller >= 60) {
      if (stopCountLabeller === 0 || flagStopLabeller == 1) {
        flagPrintLabeller = 1;
        secLabeller = 0;
        speedLabeller = ctLabeller - speedTempLabeller;
        speedTempLabeller = ctLabeller;
      }
      if (flagStopLabeller == 1) {
        timeLabeller = Date.now();
      }
    }
    secLabeller++;
    if (ctLabeller > actualLabeller) {
      stateLabeller = 1; //RUN
      if (stopCountLabeller >= timeStop) {
        speedLabeller = 0;
        secLabeller = 0;
      }
      timeLabeller = Date.now();
      stopCountLabeller = 0;
      flagStopLabeller = 0;


    } else if (ctLabeller == actualLabeller) {
      if (stopCountLabeller === 0) {
        timeLabeller = Date.now();
      }
      stopCountLabeller++;
      if (stopCountLabeller >= timeStop) {
        stateLabeller = 2; //STOP
        speedLabeller = 0;
        if (flagStopLabeller === 0) {
          flagPrintLabeller = 1;
          ////console.log(stateLabeller);
          secLabeller = 0;
        }
        flagStopLabeller = 1;
      }
    }
    if (stateLabeller == 2) {
      speedTempLabeller = ctLabeller;
    }

    actualLabeller = ctLabeller;
    if (stateLabeller == 2) {
      if (statesLabeller[5] == 1) {
        stateLabeller = 3; //Wait
      } else {
        if (statesLabeller[4] == 1) {
          stateLabeller = 4; //Block
        }
      }
    }
    Labeller = {
      ST: stateLabeller,
      CPQI: joinWord(resp.register[37], resp.register[36]),
      CPQO: joinWord(resp.register[39], resp.register[38]),
      CPQR: joinWord(resp.register[41], resp.register[40]),
      SP: speedLabeller
    };
    if (flagPrintLabeller == 1) {
      for (var key in Labeller) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_Labeller_l17.log", "tt=" + timeLabeller + ",var=" + key + ",val=" + Labeller[key] + "\n");
      }
      flagPrintLabeller = 0;
    }
    //Labeller -------------------------------------------------------------------------------------------------------------
    //Shrinkwrapper -------------------------------------------------------------------------------------------------------------
    ctShrinkwrapper = joinWord(resp.register[43], resp.register[42]);
    if (flagONS7 === 0) {
      speedTempShrinkwrapper = ctShrinkwrapper;
      flagONS7 = 1;
    }
    if (secShrinkwrapper >= 60) {
      if (stopCountShrinkwrapper === 0 || flagStopShrinkwrapper == 1) {
        flagPrintShrinkwrapper = 1;
        secShrinkwrapper = 0;
        speedShrinkwrapper = ctShrinkwrapper - speedTempShrinkwrapper;
        speedTempShrinkwrapper = ctShrinkwrapper;
      }
      if (flagStopShrinkwrapper == 1) {
        timeShrinkwrapper = Date.now();
      }
    }
    secShrinkwrapper++;
    if (ctShrinkwrapper > actualShrinkwrapper) {
      stateShrinkwrapper = 1; //RUN
      if (stopCountShrinkwrapper >= timeStop) {
        speedShrinkwrapper = 0;
        secShrinkwrapper = 0;
      }
      timeShrinkwrapper = Date.now();
      stopCountShrinkwrapper = 0;
      flagStopShrinkwrapper = 0;


    } else if (ctShrinkwrapper == actualShrinkwrapper) {
      if (stopCountShrinkwrapper === 0) {
        timeShrinkwrapper = Date.now();
      }
      stopCountShrinkwrapper++;
      if (stopCountShrinkwrapper >= timeStop) {
        stateShrinkwrapper = 2; //STOP
        speedShrinkwrapper = 0;
        if (flagStopShrinkwrapper === 0) {
          flagPrintShrinkwrapper = 1;
          ////console.log(stateShrinkwrapper);
          secShrinkwrapper = 0;
        }
        flagStopShrinkwrapper = 1;
      }
    }
    if (stateShrinkwrapper == 2) {
      speedTempShrinkwrapper = ctShrinkwrapper;
    }

    actualShrinkwrapper = ctShrinkwrapper;
    if (stateShrinkwrapper == 2) {
      if (statesShrinkwrapper[5] == 1) {
        stateShrinkwrapper = 3; //Wait
      } else {
        if (statesShrinkwrapper[4] == 1) {
          stateShrinkwrapper = 4; //Block
        }
      }
    }
    Shrinkwrapper = {
      ST: stateShrinkwrapper,
      CPQI: joinWord(resp.register[43], resp.register[42]),
      CPQO: joinWord(resp.register[45], resp.register[44]),
      //CPQR: joinWord(resp.register[41],resp.register[40]),
      SP: speedShrinkwrapper
    };
    if (flagPrintShrinkwrapper == 1) {
      for (var key in Shrinkwrapper) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_Shrinkwrapper_l17.log", "tt=" + timeShrinkwrapper + ",var=" + key + ",val=" + Shrinkwrapper[key] + "\n");
      }
      flagPrintShrinkwrapper = 0;
    }
    //Shrinkwrapper -------------------------------------------------------------------------------------------------------------
    //_3MTaper -------------------------------------------------------------------------------------------------------------
    ct_3MTaper = joinWord(resp.register[47], resp.register[46]);
    if (flagONS8 === 0) {
      speedTemp_3MTaper = ct_3MTaper;
      flagONS8 = 1;
    }
    if (sec_3MTaper >= 60) {
      if (stopCount_3MTaper === 0 || flagStop_3MTaper == 1) {
        flagPrint_3MTaper = 1;
        sec_3MTaper = 0;
        speed_3MTaper = ct_3MTaper - speedTemp_3MTaper;
        speedTemp_3MTaper = ct_3MTaper;
      }
      if (flagStop_3MTaper == 1) {
        time_3MTaper = Date.now();
      }
    }
    sec_3MTaper++;
    if (ct_3MTaper > actual_3MTaper) {
      state_3MTaper = 1; //RUN
      if (stopCount_3MTaper >= timeStop) {
        speed_3MTaper = 0;
        sec_3MTaper = 0;
      }
      time_3MTaper = Date.now();
      stopCount_3MTaper = 0;
      flagStop_3MTaper = 0;


    } else if (ct_3MTaper == actual_3MTaper) {
      if (stopCount_3MTaper === 0) {
        time_3MTaper = Date.now();
      }
      stopCount_3MTaper++;
      if (stopCount_3MTaper >= timeStop) {
        state_3MTaper = 2; //STOP
        speed_3MTaper = 0;
        if (flagStop_3MTaper === 0) {
          flagPrint_3MTaper = 1;
          ////console.log(state_3MTaper);
          sec_3MTaper = 0;
        }
        flagStop_3MTaper = 1;
      }
    }
    if (state_3MTaper == 2) {
      speedTemp_3MTaper = ct_3MTaper;
    }

    actual_3MTaper = ct_3MTaper;
    if (state_3MTaper == 2) {
      if (states_3MTaper[5] == 1) {
        state_3MTaper = 3; //Wait
      } else {
        if (states_3MTaper[4] == 1) {
          state_3MTaper = 4; //Block
        }
      }
    }
    _3MTaper = {
      ST: state_3MTaper,
      //    CPQI: joinWord(resp.register[43],resp.register[42]),
      CPQO: joinWord(resp.register[47], resp.register[46]),
      //CPQR: joinWord(resp.register[41],resp.register[40]),
      SP: speed_3MTaper
    };
    if (flagPrint_3MTaper == 1) {
      for (var key in _3MTaper) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_3MTaper_l17.log", "tt=" + time_3MTaper + ",var=" + key + ",val=" + _3MTaper[key] + "\n");
      }
      flagPrint_3MTaper = 0;
    }
    //_3MTaper -------------------------------------------------------------------------------------------------------------
    //Printer -------------------------------------------------------------------------------------------------------------
    ctPrinter = joinWord(resp.register[49], resp.register[48]);
    if (flagONS9 === 0) {
      speedTempPrinter = ctPrinter;
      flagONS9 = 1;
    }
    if (secPrinter >= 60) {
      if (stopCountPrinter === 0 || flagStopPrinter == 1) {
        flagPrintPrinter = 1;
        secPrinter = 0;
        speedPrinter = ctPrinter - speedTempPrinter;
        speedTempPrinter = ctPrinter;
      }
      if (flagStopPrinter == 1) {
        timePrinter = Date.now();
      }
    }
    secPrinter++;
    if (ctPrinter > actualPrinter) {
      statePrinter = 1; //RUN
      if (stopCountPrinter >= timeStop) {
        speedPrinter = 0;
        secPrinter = 0;
      }
      timePrinter = Date.now();
      stopCountPrinter = 0;
      flagStopPrinter = 0;


    } else if (ctPrinter == actualPrinter) {
      if (stopCountPrinter === 0) {
        timePrinter = Date.now();
      }
      stopCountPrinter++;
      if (stopCountPrinter >= timeStop) {
        statePrinter = 2; //STOP
        speedPrinter = 0;
        if (flagStopPrinter === 0) {
          flagPrintPrinter = 1;
          ////console.log(statePrinter);
          secPrinter = 0;
        }
        flagStopPrinter = 1;
      }
    }
    if (statePrinter == 2) {
      speedTempPrinter = ctPrinter;
    }

    actualPrinter = ctPrinter;
    if (statePrinter == 2) {
      if (statesPrinter[5] == 1) {
        statePrinter = 3; //Wait
      } else {
        if (statesPrinter[4] == 1) {
          statePrinter = 4; //Block
        }
      }
    }
    Printer = {
      ST: statePrinter,
      CPQI: joinWord(resp.register[49], resp.register[48]),
      CPQO: joinWord(resp.register[51], resp.register[50]),
      CPQR: joinWord(resp.register[53], resp.register[52]),
      SP: speedPrinter
    };
    if (flagPrintPrinter == 1) {
      for (var key in Printer) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_Printer_l17.log", "tt=" + timePrinter + ",var=" + key + ",val=" + Printer[key] + "\n");
      }
      flagPrintPrinter = 0;
    }
    //Printer -------------------------------------------------------------------------------------------------------------
    //Checkweigher -------------------------------------------------------------------------------------------------------------
    ctCheckweigher = joinWord(resp.register[55], resp.register[54]);
    if (flagONS10 === 0) {
      speedTempCheckweigher = ctCheckweigher;
      flagONS10 = 1;
    }
    if (secCheckweigher >= 60) {
      if (stopCountCheckweigher === 0 || flagStopCheckweigher == 1) {
        flagPrintCheckweigher = 1;
        secCheckweigher = 0;
        speedCheckweigher = ctCheckweigher - speedTempCheckweigher;
        speedTempCheckweigher = ctCheckweigher;
      }
      if (flagStopCheckweigher == 1) {
        timeCheckweigher = Date.now();
      }
    }
    secCheckweigher++;
    if (ctCheckweigher > actualCheckweigher) {
      stateCheckweigher = 1; //RUN
      if (stopCountCheckweigher >= timeStop) {
        speedCheckweigher = 0;
        secCheckweigher = 0;
      }
      timeCheckweigher = Date.now();
      stopCountCheckweigher = 0;
      flagStopCheckweigher = 0;


    } else if (ctCheckweigher == actualCheckweigher) {
      if (stopCountCheckweigher === 0) {
        timeCheckweigher = Date.now();
      }
      stopCountCheckweigher++;
      if (stopCountCheckweigher >= timeStop) {
        stateCheckweigher = 2; //STOP
        speedCheckweigher = 0;
        if (flagStopCheckweigher === 0) {
          flagPrintCheckweigher = 1;
          ////console.log(stateCheckweigher);
          secCheckweigher = 0;
        }
        flagStopCheckweigher = 1;
      }
    }
    if (stateCheckweigher == 2) {
      speedTempCheckweigher = ctCheckweigher;
    }

    actualCheckweigher = ctCheckweigher;
    if (stateCheckweigher == 2) {
      if (statesCheckweigher[5] == 1) {
        stateCheckweigher = 3; //Wait
      } else {
        if (statesCheckweigher[4] == 1) {
          stateCheckweigher = 4; //Block
        }
      }
    }
    Checkweigher = {
      ST: stateCheckweigher,
      CPQI: joinWord(resp.register[55], resp.register[54]),
      CPQO: joinWord(resp.register[57], resp.register[56]),
      CPQR: joinWord(resp.register[59], resp.register[58]),
      SP: speedCheckweigher
    };
    if (flagPrintCheckweigher == 1) {
      for (var key in Checkweigher) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_Checkweigher_l17.log", "tt=" + timeCheckweigher + ",var=" + key + ",val=" + Checkweigher[key] + "\n");
      }
      flagPrintCheckweigher = 0;
    }
    //Checkweigher -------------------------------------------------------------------------------------------------------------
    //Paletizer -------------------------------------------------------------------------------------------------------------
    ctPaletizer = joinWord(resp.register[61], resp.register[60]);
    if (flagONS11 === 0) {
      speedTempPaletizer = ctPaletizer;
      flagONS11 = 1;
    }
    if (secPaletizer >= 60) {
      if (stopCountPaletizer === 0 || flagStopPaletizer == 1) {
        flagPrintPaletizer = 1;
        secPaletizer = 0;
        speedPaletizer = ctPaletizer - speedTempPaletizer;
        speedTempPaletizer = ctPaletizer;
      }
      if (flagStopPaletizer == 1) {
        timePaletizer = Date.now();
      }
    }
    secPaletizer++;
    if (ctPaletizer > actualPaletizer) {
      statePaletizer = 1; //RUN
      if (stopCountPaletizer >= timeStop) {
        speedPaletizer = 0;
        secPaletizer = 0;
      }
      timePaletizer = Date.now();
      stopCountPaletizer = 0;
      flagStopPaletizer = 0;


    } else if (ctPaletizer == actualPaletizer) {
      if (stopCountPaletizer === 0) {
        timePaletizer = Date.now();
      }
      stopCountPaletizer++;
      if (stopCountPaletizer >= timeStop) {
        statePaletizer = 2; //STOP
        speedPaletizer = 0;
        if (flagStopPaletizer === 0) {
          flagPrintPaletizer = 1;
          ////console.log(statePaletizer);
          secPaletizer = 0;
        }
        flagStopPaletizer = 1;
      }
    }
    if (statePaletizer == 2) {
      speedTempPaletizer = ctPaletizer;
    }

    actualPaletizer = ctPaletizer;
    if (statePaletizer == 2) {
      if (statesPaletizer[5] == 1) {
        statePaletizer = 3; //Wait
      } else {
        if (statesPaletizer[4] == 1) {
          statePaletizer = 4; //Block
        }
      }
    }
    Paletizer = {
      ST: statePaletizer,
      CPQI: joinWord(resp.register[61], resp.register[60]),
      //CPQO: joinWord(resp.register[57],resp.register[56]),
      //CPQR: joinWord(resp.register[59],resp.register[58]),
      SP: speedPaletizer
    };
    if (flagPrintPaletizer == 1) {
      for (var key in Paletizer) {
        fs.appendFileSync("/home/oee/Pulse/BYD_L17_LOGS/pol_byd_Paletizer_l17.log", "tt=" + timePaletizer + ",var=" + key + ",val=" + Paletizer[key] + "\n");
      }
      flagPrintPaletizer = 0;
    }
    //Paletizer -------------------------------------------------------------------------------------------------------------
    //EOL --------------------------------------------------------------------------------------------------------------------
    if (secEOL >= 60) {
      fs.appendFileSync("../BYD_L17_LOGS/pol_byd_EOL_l17.log", "tt=" + Date.now() + ",var=EOL" + ",val=" + Paletizer.CPQI + "\n");
      secEOL = 0;
    }
    secEOL++;
    //EOL --------------------------------------------------------------------------------------------------------------------
    //PubNub --------------------------------------------------------------------------------------------------------------------
    if (secPubNub >= 60 * 5) {

      function idle() {
        i = 0;
        var actualdate = Date.now(); //Fecha actual
        var text2send = [];
        var flagInfo2Send = 0;
        for (k = 0; k < files.length; k++) { //Verificar los archivos
          var stats = fs.statSync("/home/oee/Pulse/BYD_L17_LOGS/" + files[k]);
          var mtime = new Date(stats.mtime).getTime();
          if (mtime < (Date.now() - (3 * 60 * 1000)) && files[k].indexOf("serialbox") == -1) {
            flagInfo2Send = 1;
            text2send[i] = files[k];
            i++;
          }
        }
      }

      idle();
      publishConfig = {
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          message: {
            line: "17",
            tt: Date.now(),
            machines: text2send
          }
        }
      };
      senderData();
      secPubNub = 0;
    }
    secPubNub++;
    //PubNub --------------------------------------------------------------------------------------------------------------------
  }); //END Client Read
};

clientHttp.registerMethod("postMethod", "http://35.160.68.187:23000/heartbeatLine/Byd", "POST");


function senderData() {
  clientHttp.methods.postMethod(publishConfig, function(data, response) {
    // parsed response body as js object
    console.log(data.toString());
  });
}

var assignment = function(val) {
  var result;
  if (val < 4095)
    result = "";
  else
    result = val;
  return result;
};

function hex2a(hex) {
  var str = '';
  for (var i = 0; i < hex.length; i += 2)
    str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  return str;
}

var stateMachine = function(data) {
  if (data[7] == 1) {
    return 1; //RUN
  }
  if (data[6] == 1) {
    return 2; //STOP
  }
  if (data[5] == 1) {
    return 3; //WAIT
  }
  if (data[4] == 1) {
    return 4; //BLOCK
  }
  return 2;
};

var counterState = function(actual, temp) {
  if (actual != temp) {
    return 1;
  } else {
    return 2;
  }
};

var writedata = function(varJson, nameFile) {
  var data;
  var timet = Date.now();
  for (var key in varJson) {
    fs.appendFileSync("/home/pi/Pulse/BYD_L17_LOGS/" + nameFile, "tt=" + timet + ",var=" + key + ",val=" + varJson[key] + "\n");
  }
};

var writedataBarcode = function(barcode, nameFile) {
  var timet = Date.now();
  fs.appendFileSync("../BYD_L17_LOGS/" + nameFile, "tt=" + timet + ",var=bc" + ",val=" + barcode + "\n");
};

var joinWord = function(num1, num2) {
  var bits = "00000000000000000000000000000000";
  var bin1 = num1.toString(2),
    bin2 = num2.toString(2),
    newNum = bits.split("");

  for (var i = 0; i < bin1.length; i++) {
    newNum[31 - i] = bin1[(bin1.length - 1) - i];
  }
  for (var j = 0; j < bin2.length; j++) {
    newNum[15 - j] = bin2[(bin2.length - 1) - j];
  }
  bits = newNum.join("");
  return parseInt(bits, 2);
};
var switchData = function(num1, num2) {
  var bits = "00000000000000000000000000000000";
  var bin1 = num1.toString(2),
    bin2 = num2.toString(2),
    newNum = bits.split("");

  for (var i = 0; i < bin1.length; i++) {
    newNum[15 - i] = bin1[(bin1.length - 1) - i];
  }
  for (var j = 0; j < bin2.length; j++) {
    newNum[31 - j] = bin2[(bin2.length - 1) - j];
  }
  bits = newNum.join("");

  return bits;
};

var stop = function() {
  ///This function clean data
  clearInterval(intId);
  process.exit(0);
};

var shutdown = function() {
  ///Use function STOP and close connection
  stop();
  client.close();
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);


///*If client is connect call a function "DoRead"*/
client.on('connect', function(err) {
  setInterval(function() {
    DoRead();
  }, 1000);
});

///*If client is in a error ejecute an acction*/
client.on('error', function(err) {
  fs.appendFileSync("error.log", "ID 1: " + Date.now() + ": " + err + "\n");
  //console.log('Client Error', err);
});
///If client try closed, this metodo try reconnect client to server
client.on('close', function() {
  //console.log('Client closed, stopping interval.');
  fs.appendFileSync("error.log", "ID 2: " + Date.now() + ": " + 'Client closed, stopping interval.' + "\n");
  stop();
});
