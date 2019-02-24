//import {Decimal} from 'decimal.js';

Decimal.set({
    precision: 100,
    toExpNeg: -100,
    toExpPos: 100
})

function hextofloat(){

    let hexStr = document.getElementById("hex").value;
    let exp = document.getElementById("exponent").value;
    let mts = document.getElementById("mantissa").value;

    procedure = document.getElementById("procedure");
    document.getElementById("convert-result").innerHTML = "";
    procedure.innerHTML = "Procedure: <br>";

    let dec = parseInt("0x" + hexStr, 16);
    exp = parseInt(exp, 10);
    mts = parseInt(mts, 10);


    if(isNaN(dec) || isNaN(exp) || isNaN(mts)){
        alert("Illegal Input!!!");return;
    }
    let bin = dec.toString(2);
    let binStr = ("0000" + "0".repeat(1 + exp + mts) + bin).substr(-1 - exp - mts);
    
    procedure.innerHTML += "Converted to binary: " + binStr + "<br>";

    let end = document.getElementsByName("endianess");

    let raw = "";

    if(end[1].checked){
        //process for little endian
        for(let i = binStr.length; i > 0; i -= 8){
            raw += binStr.substring(i - 8, i);
        }
        
        procedure.innerHTML += "Convert to big endian form: " + raw + "<br>";

    }else if(end[0].checked){
        //big endian
        raw = binStr;
    }else{
        //neither was selected
        alert("please select an endianess. If you don't know what this is, select big endian.")
        return;
    }

    let sign = raw.substring(0, 1);
    let exponent = raw.substring(1, 1 + exp);
    let mantissa = raw.substring(1 + exp, 1 + exp + mts);

    procedure.innerHTML += 'Sign bit: ' + sign + ' <br>Exponent bits: ' + exponent + ' <br>Mantissa bits: ' + mantissa + '<br>';

    let exponentNum = 0;
    for(let i = 0; i < exponent.length; i++){
        if(exponent.substring(i, i + 1) === "1"){
            exponentNum += Math.pow(2, 7 - i);
        }
    }
    exponentNum -= Math.pow(2, exp - 1) - 1;

    let mantissaNum = 1;
    for(let i = 0; i < mantissa.length; i++){
        if(mantissa.substring(i, i+1) === "1"){
            mantissaNum += Math.pow(2, -1 * (i + 1));
        }
    }

    let result = mantissaNum * Math.pow(2, exponentNum);

    procedure.innerHTML += "result = " + (sign === "1" ? "-" : "") + mantissaNum + " * " + "2^ " + exponentNum + "<br>";
    
    document.getElementById("convert-result").innerHTML = (sign === "1" ? "-" : "") + result;

}

function floattohex(){
    
    let f_temp = document.getElementById("float").value;

    let exp_bit = document.getElementById("exponent2").value;
    let mts_bit = document.getElementById("mantissa2").value;

    exp_bit = parseInt(exp_bit);
    mts_bit = parseInt(mts_bit);

    let f_float = parseFloat(f_temp);

    // if(isNaN(f_float) || isNaN(exp_bit) || isNaN()){
    //     alert("Illegal Input!!!");
    // }

    if(f_temp == 0){
        document.getElementById("hex-result").innerHTML = "0x00000000";
        return;
    }
    let f = new Decimal(f_temp);
    let exp = 0;
    let sign = f.greaterThan(0) ? 0 : 1;
    f = f.mul((f.greaterThan(0) ? 1 : -1));

    while(f.greaterThan(2)){
        f = f.div(2);
        exp++;
    }

    while(f.lessThan(1)){
        f = f.mul(2);
        exp--;
    }


    let mantissa = f.minus(1);
    let mStr = "";

    const two = new Decimal(2);

    for(let i = 1; i <= mts_bit; i++){
        let temp = (two.pow(-i));//.add(two.pow(-24));
        if(mantissa.greaterThan(temp) || mantissa.equals(temp)){
            mStr += "1";
            mantissa = mantissa.minus(two.pow(-i));
        }else{
            mStr += "0";
        }
    }

    let bin = sign.toString(2) + (exp + Math.pow(2, exp_bit - 1) - 1).toString(2) + mStr;

    let hex = parseInt(bin, 2).toString(16);

    document.getElementById("hex-result").innerHTML = "0x" + hex;

}