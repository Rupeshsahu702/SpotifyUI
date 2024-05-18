
let currentSong = new Audio();
let songs;
let currFolder;
// var handleClick = (note) => {
//     var path = "../../public/notes/" + note + ".mp3";
//     var audio = new Audio(path);
//     audio.play(); 
//     console.log(audio);
//     return audio.play();
//   };

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }
    seconds = Math.floor(seconds); // Remove milliseconds

    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = seconds % 60;

    // Add leading zero if necessary
    var minutesString = minutes < 10 ? "0" + minutes : minutes;
    var secondsString = remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

    return minutesString + ":" + secondsString;
}

// Example usage


async function getsongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])

        }

    }
    let songul = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songul.innerHTML = " "
    for (const song of songs) {

        songul.innerHTML = songul.innerHTML + `<li> <img class="invert" src="music.svg" alt="">
        <div class="info">
            <div> ${song.replaceAll("%20", " ")}</div>
            <div>Rupesh</div>
        </div>
        <div class="playnow">
            <span>play now</span>
            <img class="invert" src="play.svg" alt="">
        </div>
       
    </li>`;

    }
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            playmusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })
}

const playmusic = (track, pause = false) => {

    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function main() {

    await getsongs("songs/ncs")
    playmusic(songs[0], true)


    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        } else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })
    //update currentsong time
    currentSong.addEventListener("timeupdate", () => {

        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)}/${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })
    //adding an eventlistener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })

    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })
    //adding eventlistener on previous and next buttons
    previous.addEventListener("click", () => {

        let index = songs.indexOf((currentSong.src.split("/").slice(-1))[0])
        if ((index - 1) > 0) {

            playmusic(songs[index - 1])
        }
    })

    next.addEventListener("click", () => {


        let index = songs.indexOf((currentSong.src.split("/").slice(-1))[0])
        if ((index + 1) < songs.length) {

            playmusic(songs[index + 1])
        }

    })
    //adding an event to volumebar
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        currentSong.volume = parseInt(e.target.value) / 100
    })

    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })
}

main()

