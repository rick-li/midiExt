(function() {

    var embed = document.querySelector('embed');
    var midifile = embed && embed.src;

    if (!midifile) {
        return;
    }
    midifile = midifile + '?' + new Date().getTime();
    console.log('midifile is ', midifile);

    var player = MIDI.Player;
    var elapsed = 0;
    var length = 60 * 60 * 1000;
    window.stopmusic = null;

    whenTimeElapse(function(data) {
        elapsed += 1000;
        updateTimeCode();
        if (data.now >= data.end) {
            if (elapsed < length) {
                console.log('loop...');
                player.currentTime = 0;
                player.start();
            } else {
                window.location = "https://www.duosuccess.com";
            }
        }
    });


    loadMidiPlugin().then(loadFile).then(playMidi);


    function playMidi() {
        console.log('before play midi.');
        player.start();
        return Promise.resolve();
    }

    function loadMidiPlugin() {
        return new Promise(function(resolve, reject) {
            MIDI.WebAudio.connect({
                instrument: "acoustic_grand_piano",
                callback: function() {
                    console.log('load webaudio completed.');
                    resolve();
                }
            });
        });
    }

    function loadFile() {
        return new Promise(function(resolve, reject) {
            console.log('start to load file.');
            player.loadFile(midifile, function() {
                resolve();
            });
        });
    }

    function whenTimeElapse(callback) {
        player.setAnimation({
            interval: 1000,
            callback: callback
        });
    }

    function updateTimeCode() {
        // console.log('elpased: ', elapsed);
        var mins = parseInt(elapsed / (1000 * 60));
        var secs = parseInt((elapsed - (mins * 60 * 1000)) / 1000);
        var timecodeTxt = mins.pad() + ':' + secs.pad();
        var timecodeEl = document.getElementById('timecode');
        if (!timecodeEl) {
            createTimeCodeLabel();
        } else {
            timecodeEl.innerText = timecodeTxt;
        }
    }

    function createTimeCodeLabel() {
        var labelWrapper = document.createElement('div');
        labelWrapper.setAttribute('id', 'timecode');
        labelWrapper.style.position = 'fixed';
        labelWrapper.style.right = '10px';
        labelWrapper.style.bottom = '5px';
        labelWrapper.style.height = '30px';
        labelWrapper.style.width = '50px';
        labelWrapper.style.fontSize = '20px';
        labelWrapper.style.color = 'blue';
        document.body.appendChild(labelWrapper);
    }

    Number.prototype.pad = function(size) {
        var s = String(this);
        if (typeof(size) !== "number") {
            size = 2;
        }

        while (s.length < size) {
            s = "0" + s;
        }
        return s;
    };
})();