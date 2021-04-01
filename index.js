const express = require('express');
const speakeasy = require('@levminer/speakeasy');
const QRCode = require('qrcode');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const secret = speakeasy.generateSecret({
    name: "sugarizer-server"
});
console.log(secret);

app.get('/', (req, res) => {
    res.redirect('/twofactorsetup');
    res.send('kindly wait you are being navigated to /twofactorsetup to test this demo app.');
})

app.get('/twofactorsetup', (req, res) => {
    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
        res.send(
            `<h1>demo app of 2FA for this year's GSoC by Jaikishan Brijwani</h1>
            <h3>use the qr code on your authenticator</h3>
            <img src=${data_url}><br>
            or add manually: ${secret.base32}`
        );
    })
})

app.post('/verify', (req, res) => {
    const token = req.body.userToken;
    console.log(token);
    const verfied = speakeasy.totp.verify({ secret: secret.base32, encoding: 'base32', token: token });
    res.json({ success: verfied });
})

app.listen(3000, (err) => {
    if(err) console.log(err);
    console.log('server started at port 3000');
});