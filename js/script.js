console.log("Let's write some javascript")
let currentSong = new Audio();
let songs;
let currFolder;

function formatTime(seconds) {
    // Ensure seconds is a non-negative number
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    // Convert total seconds into minutes and remaining seconds
    const minutes = Math.floor(seconds / 60); // Calculate the minutes
    const remainingSeconds = Math.floor(seconds % 60); // Get the remaining seconds

    // Format minutes and seconds as two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder=folder;
    let a = await fetch(`${folder}/`)
    let response = await a.text();
    // console.log(response);
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    // console.log(as)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // console.log(element.href.split(`/${folder}/`)[1])
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }

    // console.log(songs)



    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li>
                            <img src="img/music.svg" alt="">
                            <div class="info">
                                <div style="font-weight: bolder;">${song.replaceAll("%20", " ")}</div>
                                <div>${song.replaceAll("%20", " ").split("-")[1].replace(".mp3", " ")}</div>
                            </div>
                            <div class="playnow">
                                <span class="plnowtxt">Play Now</span>
                                <img src="img/pbarplay.svg" alt="">
                            </div>`
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })

    })

    return songs

}



const playMusic = (track) => {
    // let audio = new Audio("/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    currentSong.play()
    play.src="img/pause.svg"
    document.querySelector(".songinfo").innerHTML  = track.replaceAll("%20", " ");
    document.querySelector(".songtime").innerHTML  = "00:00 / 00:00"

}

Array.from(document.getElementsByClassName("card")).forEach(e=>{
    e.addEventListener("click",async item=>{
        songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    })
})






async function displayAlbums() {
    console.log("displaying albums")
    let a = await fetch(`/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    console.log(response)
    let anchors = div.getElementsByTagName("a")
    let cardContainer = document.querySelector(".cards")
    let array = Array.from(anchors)
    console.log(array)
    for (let index = 0; index < array.length; index++) {
        const e = array[index]; 
        console.log(e);
        if (e.href.includes("/songs")) {
            let folder = e.href.split("/").slice(-2)[0]
            console.log(folder)
            // Get the metadata of the folder
            let a = await fetch(`/songs/${folder}/info.json`)
            let response = await a.json(); 
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <button class="but">
                            <img class"butin" style="padding-left: 5px;" src="img/play-svgrepo-com.svg" alt=""></button>


                        <div class="imgban"><img  class="cardcov" style="border-radius: 4px;" src="/songs/${folder}/cover.jpeg" alt="">
                        </div>
                        <div class="info">
                            <h6 class="cardh" style="color: white;">${response.title}</h6>
                            <p class="carddep" style="color: lightgray;padding-top: 4px;">${response.description}</p>
                        </div>
                    </div>`
        }
    }

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => { 
        e.addEventListener("click", async item => {
            console.log("Fetching Songs")
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
            playMusic(songs[0])

        })
    })
}


async function main() {


    await getSongs("songs/rap")
    playMusic(songs[0], true)
    play.src = "img/pbarplay.svg"

    // Display all the albums on the page
    await displayAlbums()


   
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "img/pause.svg"
        }
        else {   
            currentSong.pause()
            play.src = "img/pbarplay.svg"
        }
    })


    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime/ currentSong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = (e.offsetX/e.target.getBoundingClientRect().width)*100 + "%";
        currentSong.currentTime= ((currentSong.duration)*percent)/100;
    
    })

    document.querySelector(".hamburger").addEventListener("click", e=>{

        document.querySelector(".left").style.left= "0";
    })


    document.querySelector(".close").addEventListener("click", e=>{
        document.querySelector(".left").style.left= "-120%";
    })

    previous.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Previous clicked")
        console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index-1) >= 0){
            playMusic(songs[index-1])
        }else play.src = "img/pbarplay.svg"
    })

    next.addEventListener("click",()=>{
        currentSong.pause()
        console.log("Next clicked")
        // console.log(currentSong)
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if((index+1) < (songs.length)){
            playMusic(songs[index+1])
        }else play.src = "img/pbarplay.svg"
    })

    
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100")
        currentSong.volume = parseInt(e.target.value) / 100
        if (currentSong.volume <=0){
            document.querySelector(".volume>img").src = "img/mute.svg";
        }
        else{
            document.querySelector(".volume>img").src = "img/vol.svg";
        }
    })

    document.querySelector(".volume>img").addEventListener("click", e=>{ 
        if(e.target.src.includes("img/vol.svg")){
            e.target.src = e.target.src.replace("img/vol.svg", "img/mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("img/mute.svg", "img/vol.svg")
            currentSong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }

    })


    
    
}

main()