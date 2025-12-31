var now = new Date();
var currentYear = now.getFullYear();
var currentMonth = now.getMonth();
var currentDate = now.getDate();

var isCelebrationPeriod = (currentMonth === 0 && currentDate <= 7);

var celebrateYear = currentYear;
var nextYear = currentYear + 1;

var countDownDate = new Date("Jan 1, " + nextYear + " 00:00:00").getTime();

var showCelebration = isCelebrationPeriod;

var optionsWaiting = {
    strings: ["Menunggu tahun " + nextYear, "Sudahkah kalian membuat revolusi?"],
    typeSpeed: 50,
    backSpeed: 25,
    showCursor: true,
    cursorChar: '_',
    loop: true,
};

var optionsNewYear = {
    strings: ["Selamat Tahun Baru " + celebrateYear + "!", "Semangat baru untuk revolusi tahun ini!"],
    typeSpeed: 50,
    backSpeed: 25,
    showCursor: true,
    cursorChar: '_',
    loop: true,
};

if (showCelebration) {
    var typewriter = new Typed("#typewriter", optionsNewYear);
    document.getElementById("countdown").innerHTML = "Happy New Year!";
    document.title = "Selamat tahun baru " + celebrateYear;
    displayFireworks();
} else {
    var typewriter = new Typed("#typewriter", optionsWaiting);
    
    var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;

        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);

        days = (days < 10) ? '0' + days : days;
        hours = (hours < 10) ? '0' + hours : hours;
        minutes = (minutes < 10) ? '0' + minutes : minutes;
        seconds = (seconds < 10) ? '0' + seconds : seconds;

        document.getElementById("countdown").innerHTML = days + ":" + hours + ":" + minutes + ":" + seconds;

        if (distance < 0) {
            clearInterval(x);
            
            document.getElementById("countdown").innerHTML = "Happy New Year!";
            document.title = "Selamat tahun baru " + nextYear;
            typewriter.destroy();

            typewriter = new Typed("#typewriter", {
                strings: ["Selamat Tahun Baru " + nextYear + "!", "Semangat baru untuk revolusi tahun ini!"],
                typeSpeed: 50,
                backSpeed: 25,
                showCursor: true,
                cursorChar: '_',
                loop: true,
            });
            displayFireworks();
        }
    }, 1000);
}

function displayFireworks() {
    var audio = new Audio('sound.mp3');
        audio.play();

    var c = document.getElementById("Canvas");
    var ctx = c.getContext("2d");

    var cwidth, cheight;
    var shells = [];
    var pass = [];

    var colors = ['#FF5252', '#FF4081', '#E040FB', '#7C4DFF', '#536DFE', '#448AFF', '#40C4FF', '#18FFFF', '#64FFDA', '#69F0AE', '#B2FF59', '#EEFF41', '#FFFF00', '#FFD740', '#FFAB40', '#FF6E40'];

    window.onresize = function () { reset(); }
    reset();
    function reset() {

        cwidth = window.innerWidth;
        cheight = window.innerHeight;
        c.width = cwidth;
        c.height = cheight;
    }

    function newShell() {

        var left = (Math.random() > 0.5);
        var shell = {};
        shell.x = (1 * left);
        shell.y = 1;
        shell.xoff = (0.01 + Math.random() * 0.007) * (left ? 1 : -1);
        shell.yoff = 0.01 + Math.random() * 0.007;
        shell.size = Math.random() * 6 + 3;
        shell.color = colors[Math.floor(Math.random() * colors.length)];

        shells.push(shell);
    }

    function newPass(shell) {

        var pasCount = Math.ceil(Math.pow(shell.size, 2) * Math.PI);

        for (i = 0; i < pasCount; i++) {

            var pas = {};
            pas.x = shell.x * cwidth;
            pas.y = shell.y * cheight;

            var a = Math.random() * 4;
            var s = Math.random() * 10;

            pas.xoff = s * Math.sin((5 - a) * (Math.PI / 2));
            pas.yoff = s * Math.sin(a * (Math.PI / 2));

            pas.color = shell.color;
            pas.size = Math.sqrt(shell.size);

            if (pass.length < 1000) { pass.push(pas); }
        }
    }

    var lastRun = 0;
    Run();
    function Run() {
        var dt = 1;
        if (lastRun != 0) { dt = Math.min(50, (performance.now() - lastRun)); }
        lastRun = performance.now();

        //ctx.clearRect(0, 0, cwidth, cheight);
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(0, 0, cwidth, cheight);

        if ((shells.length < 10) && (Math.random() > 0.96)) { newShell(); }

        for (let ix in shells) {

            var shell = shells[ix];

            ctx.beginPath();
            ctx.arc(shell.x * cwidth, shell.y * cheight, shell.size, 0, 2 * Math.PI);
            ctx.fillStyle = shell.color;
            ctx.fill();

            shell.x -= shell.xoff;
            shell.y -= shell.yoff;
            shell.xoff -= (shell.xoff * dt * 0.001);
            shell.yoff -= ((shell.yoff + 0.2) * dt * 0.00005);

            if (shell.yoff < -0.005) {
                newPass(shell);
                shells.splice(ix, 1);
            }
        }

        for (let ix in pass) {

            var pas = pass[ix];

            ctx.beginPath();
            ctx.arc(pas.x, pas.y, pas.size, 0, 2 * Math.PI);
            ctx.fillStyle = pas.color;
            ctx.fill();

            pas.x -= pas.xoff;
            pas.y -= pas.yoff;
            pas.xoff -= (pas.xoff * dt * 0.001);
            pas.yoff -= ((pas.yoff + 5) * dt * 0.0005);
            pas.size -= (dt * 0.002 * Math.random())

            if ((pas.y > cheight) || (pas.y < -50) || (pas.size <= 0)) {
                pass.splice(ix, 1);
            }
        }
        requestAnimationFrame(Run);
    }
}
