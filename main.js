var MicroBitBle;
var Blink;
var gpioPort0;
var gpioPort2;
var GpioPort14;
var GpioPort13;
var GpioPort15;
var GpioPort16;
var msg = document.getElementById("msg");

async function connect() {
  MicroBitBle = await microBitBleFactory.connect();
  msg.innerHTML = "micro:bit BLE接続しました。";
  var gpioAccess = await MicroBitBle.requestGPIOAccess();
  var mbGpioPorts = gpioAccess.ports;
  GpioPort14 = mbGpioPorts.get(14);
  GpioPort13 = mbGpioPorts.get(13);
  GpioPort15 = mbGpioPorts.get(15);
  GpioPort16 = mbGpioPorts.get(16);
  await GpioPort14.export("out"); //port0 out
  await GpioPort13.export("out"); //port1 out
  await GpioPort15.export("out"); //port2 out
  await GpioPort16.export("out"); //port8 out
  gpioPort0 = mbGpioPorts.get(0);
  gpioPort2 = mbGpioPorts.get(2);
  await gpioPort0.export("analogin"); //port0 analogin : pull none
  await gpioPort2.export("analogin"); //port2 analogin : pull none
  Blink = true;
  measure();
}

async function disconnect() {
  await MicroBitBle.disconnect();
  msg.innerHTML = "micro:bit BLE接続を切断しました。";
}

async function measure() {
  var g0Val;
  var g2Val;

  //console.log("Start measure");
  //console.log(Blink);

  while (Blink) {
    g0Val = await gpioPort0.read();
    gdata0.innerHTML = g0Val;
    g2Val = await gpioPort2.read();
    gdata2.innerHTML = g2Val;
    await motorControl(g0Val - g2Val);
    //console.log(g0Val);
    //console.log(g2Val);
    await sleep(500);
  }
}
async function motorControl(val) {
  if (val < 0) {
    await GpioPort15.write(false); //1p
    await GpioPort16.write(true); //1p
    await GpioPort13.write(true); //2p
    await GpioPort14.write(false); //2p
  } else if (0 < val) {
    await GpioPort15.write(true); //1p
    await GpioPort16.write(false); //1p
    await GpioPort13.write(false); //2p
    await GpioPort14.write(true); //2p
  } else {
    await GpioPort15.write(false); //1p
    await GpioPort16.write(false); //1p
    await GpioPort13.write(false); //2p
    await GpioPort14.write(false); //2p
  }
  msg.innerHTML = "モーター駆動状態 : " + val;
}

async function condition1p(val) {
  //1p調整
  if (val > 5) {
    await GpioPort15.write(false); //1p
    await GpioPort16.write(true); //1p
  } else {
    await GpioPort15.write(false); //1p
    await GpioPort16.write(true); //1p
  }
}
async function condition2p(val) {
  console.log(val);
  //2p調整
  if (val > 5) {
    await GpioPort13.write(true); //2p
    await GpioPort14.write(false); //2p
  } else {
    await GpioPort13.write(true); //2p
    await GpioPort14.write(false); //2p
  }
}
