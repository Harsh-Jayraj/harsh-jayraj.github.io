/*
  MBASCAPE — Logic File
  - Team of up to 5 players
  - Regions, Puzzles, and Clues are randomized for replayability.
*/

const TARGET_PHRASE = "FINAL LOCK";
const TARGET = TARGET_PHRASE.replace(/\s+/g, "");
const TRAY_SLOTS = TARGET.length;

// --- Custom Alert Function ---
function showAlert(title, message, subscript, callback) {
    const backdrop = document.getElementById('alertModalBackdrop');
    if (!backdrop) {
      console.error('Alert modal not found in HTML!');
      alert(`${title}\n\n${message}`); // Fallback
      return;
    }
    const subscriptEl = document.getElementById('alertModalSubscript');
    document.getElementById('alertModalTitle').textContent = title;
    document.getElementById('alertModalMessage').textContent = message;

    if (subscript && subscriptEl) {
        subscriptEl.textContent = subscript;
        subscriptEl.style.display = 'block';
    } else if (subscriptEl) {
        subscriptEl.style.display = 'none';
    }
    
    backdrop.style.display = 'flex';
    const closeBtn = document.getElementById('alertModalCloseBtn');
    
    const closeHandler = () => {
        backdrop.style.display = 'none';
        if (callback) {
            callback();
        }
    };
    closeBtn.addEventListener('click', closeHandler, { once: true });
}

// --- Data Definitions ---
const PUZZLES = [
      { prompt: "I am taken from a mine, locked in a wooden case, and used every day. What am I?", answer: "Pencil lead" },
      { prompt: "The more you cut me, the bigger I grow.", answer: "Debt" },
      { prompt: "What begins with an “e” but only has one letter?", answer: "Envelope" },
      { prompt: "You see me once in a minute, twice in a moment, never in a thousand years.", answer: "M" },
      { prompt: "I’m light as a feather, yet the strongest man can’t hold me more than a minute.", answer: "Breath" },
      { prompt: "If you feed me, I live. If you water me, I die.", answer: "Fire" },
      { prompt: "I shave every day, but my beard stays the same.", answer: "Barber" },
      { prompt: "I have a neck but no head, two arms but no hands.", answer: "Shirt" },
      { prompt: "I am always running but never move.", answer: "Time" },

      { prompt: "If 3 cats catch 3 mice in 3 minutes, how many cats are needed to catch 100 mice in 100 minutes?", answer: "3" },
      { prompt: "Find the missing number: 2, 6, 12, 20, ? (Add consecutive even numbers)", answer: "30" },
      { prompt: "A farmer has 17 sheep. All but 9 die. How many remain?", answer: "9" },
      { prompt: "What is the sum of all numbers from 1 to 50?", answer: "1275" },
      { prompt: "How many core committees are there in IMT?", answer: "8" },
      { prompt: "Roman numeral puzzle: Convert XLIV", answer: "44" },
      { prompt: "Which is larger: 2³ × 3² or 5³?", answer: "5³" },
      { prompt: "If it takes 5 machines 5 minutes to make 5 gadgets, how many minutes will 100 machines take to make 100 gadgets?", answer: "5" },
      { prompt: "What’s the next prime after 47?", answer: "53" },
      { prompt: "Find X: 3X + 7 = 25", answer: "6" },

      { prompt: "Who painted the ceiling of the Sistine Chapel?", answer: "Michelangelo" },
      { prompt: "What is the capital of Canada?", answer: "Ottawa" },
      { prompt: "In which country is Mount Kilimanjaro?", answer: "Tanzania" },
      { prompt: "The chemical symbol for Gold", answer: "Au" },
      { prompt: "What year did World War II end?", answer: "1945" },
      { prompt: "Which planet has the longest day?", answer: "Venus" },
      { prompt: "First person to circumnavigate the Earth?", answer: "Magellan" },
      { prompt: "What’s the cultural flower of Japan?", answer: "Cherry Blossom" },
      { prompt: "Which Shakespeare play features witches chanting 'Double, double toil and trouble'?", answer: "Macbeth" },
      { prompt: "Who discovered penicillin?", answer: "Alexander Fleming" },

      { prompt: "Unscramble: RTAES", answer: "Stare" },
      { prompt: "Unscramble: TNLAP", answer: "Plant" },
      { prompt: "A palindrome word for a female parent", answer: "Mom" },
      { prompt: "Change one letter in 'FOLD' to make something you eat.", answer: "Food" },
      { prompt: "What English word keeps the same pronunciation even after removing 4 of its 5 letters?", answer: "Queue" },
      { prompt: "What 9-letter word still makes a word when you remove one letter at a time until only one is left?", answer: "Startling" },
      { prompt: "Opposite of 'Scarce'", answer: "Abundant" },
      { prompt: "What 5-letter word becomes shorter when you add 2 letters?", answer: "Short" },
      { prompt: "Hidden word: EVEning", answer: "Eve" },
      { prompt: "Rearrange: Dormitory", answer: "Dirty Room" },

      { prompt: "What is the square root of 144?", answer: "12" },
      { prompt: "Next in the sequence: 1, 1, 2, 3, 5, 8, ?", answer: "13" },
      { prompt: "What is sin 30°?", answer: "0.5" },
      { prompt: "Write 2025 in Roman numerals", answer: "MMXXV" },
      { prompt: "A triangle has angles 90°, 45°, ?", answer: "45°" },
      { prompt: "2³ × 4² = ?", answer: "128" },
      { prompt: "How many sides does a dodecagon have?", answer: "12" },
      { prompt: "What is the cube of 7?", answer: "343" },
      { prompt: "What is 15% of 200?", answer: "30" },
      { prompt: "Find the odd one: 36, 49, 64, 81, 100", answer: "49" },

      { prompt: "Sherlock Holmes’ assistant", answer: "Watson" },
      { prompt: "“Winter is Coming” is from which TV show?", answer: "Game of Thrones" },
      { prompt: "What is Superman’s real name?", answer: "Clark kent" },
      { prompt: "What is the name of Last AI used by tony stark", answer: "Friday" },
      { prompt: "Who lives in a pineapple under the sea?", answer: "SpongeBob" },
      { prompt: "What is Thor’s hammer called?", answer: "Mjolnir" },
      { prompt: "Which Hogwarts house values courage?", answer: "Gryffindor" },
      { prompt: "Who created Mickey Mouse?", answer: "Walt Disney" },
      { prompt: "First Pokémon in the Pokédex", answer: "Bulbasaur" },
      { prompt: "In Matrix, does Neo take the red or blue pill to escape?", answer: "Red" },

      { prompt: "Count the number of F’s in: “Finished files are the result of years of scientific study.”", answer: "5" },
      { prompt: "Rearrange the letters of LISTEN to form another word", answer: "Silent" },
      { prompt: "What comes once in a year, twice in a week, never in a day?", answer: "E" },
      { prompt: "First three digits of Pi", answer: "3.14" },
      { prompt: "If a dozen eggs costs ₹60, how much does one egg cost?", answer: "₹5" },
      { prompt: "What is the longest english word without any vowel?", answer: "Rhythm" },
      { prompt: "How many 0’s in one million?", answer: "6" },
      { prompt: "Which letter is also a question?", answer: "Y" },
      { prompt: "What has keys but can’t open any door?", answer: "Piano" },
      { prompt: "Which word is always spelled wrong in a dictionary?", answer: "Wrong" },

      { prompt: "The man who made it doesn’t want it, the man who bought it doesn’t need it, the man who uses it doesn’t know it.", answer: "Coffin" },
      { prompt: "The more you take from me, the more I grow.", answer: "Hole" },
      { prompt: "Forward I’m heavy, backward I’m not.", answer: "Ton" },
      { prompt: "What word begins and ends with an E, but has only one letter?", answer: "Envelope" },
      { prompt: "I’m in the sky but never in the sun. I’m in the sea but never in the ocean.", answer: "Letter S" },
      { prompt: "The more of me you see, the less you see.", answer: "Fog" },
      { prompt: "I have a neck but no head, I have two arms but no hand?", answer: "Shirt" },
      { prompt: "I have keys but no locks, space but no room.", answer: "Keyboard" },
      { prompt: "What has many teeth but cannot bite?", answer: "COMB" },
      { prompt: "The beginning of eternity, the end of time and space, the beginning of every end.", answer: "Letter E" },

      { prompt: "Tallest mountain in the world", answer: "Everest" },
      { prompt: "Chemical symbol for Silver", answer: "Ag" },
      { prompt: "Who developed the theory of relativity?", answer: "Einstein" },
      { prompt: "First book of the Bible", answer: "Genesis" },
      { prompt: "Which gas do plants release during photosynthesis?", answer: "Oxygen" },
      { prompt: "Largest desert in the world", answer: "Antarctica" },
      { prompt: "Capital of Australia", answer: "Canberra" },
      { prompt: "Who invented the telephone?", answer: "Alexander Graham Bell" },
      { prompt: "Which planet is known as the Morning Star?", answer: "Venus" },
      { prompt: "First element on the periodic table", answer: "Hydrogen" },

      { prompt: "Word hidden inside Underground", answer: "Ground" },
      { prompt: "If A = 1, B = 2, what does C + A + T equal?", answer: "24" },
      { prompt: "I am an odd number. Take away one letter and I become even.", answer: "Seven" },
      { prompt: "What is always coming but never arrives?", answer: "Tomorrow" },
      { prompt: "Which number looks the same upside down?", answer: "8" },
      { prompt: "A circle has how many degrees?", answer: "360" },
      { prompt: "Which common word changes makes things change every time?", answer: "Random" },
      { prompt: "What flies without wings and can destroy everything?", answer: "Time" },
      { prompt: "I am measured in hours, I serve by being devoured.", answer: "Candle" },
      { prompt: "What starts with P, ends with E, and has thousands of letters?", answer: "Post Office" }
    ];

const REGIONS = [
  {id:"library", name:"Library", clue:"X"}, {id:"academic", name:"Academic Block", clue:"X"}, {id:"hostel", name:"Hostel", clue:"X"}, {id:"mess", name:"Mess & Cafeteria", clue:"X"}, {id:"sports", name:"Sports Ground", clue:"X"}, {id:"amphi", name:"Amphitheatre", clue:"X"}, {id:"lab", name:"Analytics Lab"}, {id:"ground", name:"Open Ground", clue:"X"}, {id:"seminar", name:"Seminar Hall", clue:"X"}, {id:"library2", name:"Library 2nd Floor"}, {id:"dorm", name:"Dormitory", clue:"X"}, {id:"classroom", name:"Classroom"}, {id:"parking", name:"Parking Lot", clue:"X"}, {id:"canteen", name:"Canteen"}, {id:"auditorium", name:"Auditorium"}, {id:"garden", name:"Campus Garden"}, {id:"lab2", name:"Data Lab", clue:"X"}, {id:"library3", name:"Library Basement"}, {id:"faculty", name:"Faculty Offices", clue:"X"}, {id:"rec_room", name:"Recreation Room", clue:"X"},
];

// --- Randomization Logic ---
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}
function randomizeClues() {
  const clueLetters = TARGET.split('');
  shuffleArray(clueLetters);
  const clueRegions = REGIONS.filter(r => r.hasOwnProperty('clue'));
  clueRegions.forEach((region, index) => {
    if (index < clueLetters.length) region.clue = clueLetters[index];
    else delete region.clue; 
  });
}
function randomizePuzzles() {
  const puzzlePool = [...PUZZLES];
  shuffleArray(puzzlePool);
  REGIONS.forEach(region => {
    const numPuzzles = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
    region.puzzles = [];
    for (let i = 0; i < numPuzzles; i++) {
      if (puzzlePool.length > 0) region.puzzles.push(puzzlePool.pop());
      else break;
    }
  });
}
function setupNewGame() {
  shuffleArray(REGIONS); // Shuffle the regions for better randomness
  randomizePuzzles();
  randomizeClues();
}

// --- Game State & DOM Refs ---
let players = [], regionState = {}, clues = [], undoStack = [];
let playerCount = 0, timerInterval = null, secondsElapsed = 0;
let tray = Array(TRAY_SLOTS).fill(null), gameStarted = false;
let currentPlayerIndex = -1;

const mapEl = document.getElementById('map'), inventoryEl = document.getElementById('inventory');
const trayEl = document.getElementById('tray');
const timerEl = document.getElementById('timer'), startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn'), playerPills = document.getElementById('playerPills');
const playerCountEl = document.getElementById('playerCount'), modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle'), modalSub = document.getElementById('modalSub');
const puzzlePrompt = document.getElementById('puzzlePrompt'), puzzleAnswer = document.getElementById('puzzleAnswer');
const submitAnswerBtn = document.getElementById('submitAnswer'), puzzleMsg = document.getElementById('puzzleMsg');
const regionStatus = document.getElementById('regionStatus'), regionSearched = document.getElementById('regionSearched');
const searchRegionBtn = document.getElementById('searchRegion'), closeModalBtn = document.getElementById('closeModal');
const collectorSelect = document.getElementById('collectorSelect'), unlockBtn = document.getElementById('unlockBtn');
const undoBtn = document.getElementById('undoBtn'), resetTrayBtn = document.getElementById('resetTrayBtn');
const trayLabel = document.getElementById('trayLabel');

// --- Core Game Functions ---
function init() {
  const playersData = localStorage.getItem('mbascape_players');
  if (playersData) {
    players = JSON.parse(playersData);
    players.forEach(p => p.cluesFound = 0);
    playerCount = players.length;
  } else {
    showAlert('No Team Data', "No team data found. Returning to team creation screen.", null, () => {
        window.location.href = 'index.html';
    });
    return;
  }
  
  setupNewGame();
  
  mapEl.innerHTML = '';
  for (const r of REGIONS) {
    const el = document.createElement('div');
    el.className = 'region';
    el.id = 'reg-' + r.id;
    el.innerHTML = `<h3>${r.name}</h3><div class="small">${r.id}</div>
      <div style="margin-top:8px" class="region-meta">
        <div class="status" id="status-${r.id}">🔒 Locked</div>
        <div class="small" id="searched-${r.id}">Unsearched</div>
      </div>`;
    el.addEventListener('click', () => openRegion(r.id));
    mapEl.appendChild(el);
    regionState[r.id] = { solved:false, searched:false, collector:null, incorrectAttempts: 0, currentPuzzleIndex: 0 };
  }
  trayLabel.textContent = `Final Lock Tray (${TRAY_SLOTS} letters)`;
  trayEl.style.gridTemplateColumns = `repeat(${TRAY_SLOTS}, 1fr)`;
  
  secondsElapsed = 0;
  updateTimerDisplay();
  populatePlayerPills();
  populateCollectorSelect();
  renderTray();
  renderInventory();
  updatePlayerCount();
  attachEventHandlers();
}
function attachEventHandlers(){
  startBtn.addEventListener('click', startGame);
  resetBtn.addEventListener('click', resetGame);
  closeModalBtn.addEventListener('click', closeModal);
  submitAnswerBtn.addEventListener('click', submitPuzzleAnswer);
  searchRegionBtn.addEventListener('click', handleSearchFromModal);
  puzzleAnswer.addEventListener('keydown', (e)=>{ if(e.key==='Enter') submitPuzzleAnswer(); });
  unlockBtn.addEventListener('click', tryUnlock);
  undoBtn.addEventListener('click', undoLast);
  resetTrayBtn.addEventListener('click', resetTray);
}
function populatePlayerPills(){
  playerPills.innerHTML = '';
  for(const p of players) {
    const el = document.createElement('div');
    el.className='player-pill';
    el.textContent = `${p.name} (${p.cluesFound})`;
    playerPills.appendChild(el);
  }
}
function populateCollectorSelect(){
  collectorSelect.innerHTML = '';
  for(const p of players){
    const opt = document.createElement('option');
    opt.value = p.id; opt.textContent = p.name;
    collectorSelect.appendChild(opt);
  }
}
function updatePlayerCount(){
  playerCountEl.textContent = String(players.length);
}
function startGame(){
  if (gameStarted) return;
  gameStarted = true;
  startBtn.disabled = true;
  startBtn.textContent = 'Game Running';
  secondsElapsed = 0;
  timerInterval = setInterval(()=>{
    secondsElapsed++;
    updateTimerDisplay();
  },1000);
}
function updateTimerDisplay(){
  const m = Math.floor(secondsElapsed/60).toString().padStart(2,'0');
  const s = (secondsElapsed%60).toString().padStart(2,'0');
  timerEl.textContent = `${m}:${s}`;
}
function resetGame(){
  if (confirm("Are you sure you want to start a new game? This will return you to the team creation screen.")) {
    localStorage.removeItem('mbascape_players');
    window.location.href = 'index.html';
  }
}
function loadPuzzleInModal(regionId) {
    const region = REGIONS.find(r => r.id === regionId);
    const state = regionState[regionId];
    const puzzleIndex = state.currentPuzzleIndex;
    const totalPuzzles = region.puzzles.length;
    modalSub.textContent = `Puzzle ${puzzleIndex + 1} of ${totalPuzzles}`;
    const currentPuzzle = region.puzzles[puzzleIndex];
    puzzlePrompt.textContent = currentPuzzle.prompt;
    puzzleAnswer.value = '';
    puzzleMsg.innerHTML = '';
}
function openRegion(regionId) {
    if (!gameStarted) {
        showAlert('Game Not Started', "Please start the game first!", null, null);
        return;
    }
    if (players.length > 0) {
        currentPlayerIndex = (currentPlayerIndex + 1) % players.length;
        collectorSelect.value = players[currentPlayerIndex].id;
    }
    const region = REGIONS.find(r => r.id === regionId);
    if (!region) return;
    const state = regionState[regionId];
    modalTitle.textContent = region.name;
    modalBackdrop.dataset.region = regionId;
    modalBackdrop.style.display = 'flex';
    regionStatus.textContent = state.solved ? '✅ Escaped' : '🔒 Locked';
    regionSearched.textContent = state.searched ? 'Yes' : 'No';
    closeModalBtn.disabled = !state.solved; // Lock the close button until solved
    closeModalBtn.classList.toggle('disabled', !state.solved);

    if (state.solved) {
        modalSub.textContent = state.searched ? "Region Searched" : "Region Escaped";
        puzzlePrompt.textContent = state.searched ? "You have already searched this region for clues." : "You have solved all the puzzles here. You can now search for a clue.";
        puzzleAnswer.style.display = 'none';
        submitAnswerBtn.style.display = 'none';
        searchRegionBtn.disabled = state.searched;
        searchRegionBtn.classList.toggle('disabled', state.searched);
        puzzleMsg.innerHTML = '';
    } else {
        puzzleAnswer.style.display = 'block';
        submitAnswerBtn.style.display = 'block';
        searchRegionBtn.disabled = true;
        searchRegionBtn.classList.add('disabled');
        loadPuzzleInModal(regionId);
    }
}
function closeModal(){
  const regionId = modalBackdrop.dataset.region;
  if (regionId && !regionState[regionId].solved) {
    puzzleMsg.innerHTML = '<div class="small" style="color:#ff9aa2">You must solve all puzzles to leave this region!</div>';
    return;
  }
  modalBackdrop.style.display='none'; 
  modalBackdrop.dataset.region=''; 
}
function submitPuzzleAnswer(){
  const regionId = modalBackdrop.dataset.region;
  if(!regionId) return;
  const region = REGIONS.find(r => r.id === regionId);
  const state = regionState[regionId];
  const currentPuzzle = region.puzzles[state.currentPuzzleIndex];
  const ans = (puzzleAnswer.value||'').trim().toUpperCase();
  if(!ans){ puzzleMsg.innerHTML = '<div class="small">Type an answer first.</div>'; return; }
  const correct = currentPuzzle.answer.toString().trim().toUpperCase();
  if(ans === correct){
    state.incorrectAttempts = 0;
    state.currentPuzzleIndex++;
    if (state.currentPuzzleIndex >= region.puzzles.length) {
      state.solved = true;
      puzzleMsg.innerHTML = '<div class="message">All puzzles solved! Region escaped — now SEARCH to find the clue.</div>';
      regionStatus.textContent = '✅ Escaped';
      searchRegionBtn.disabled = false;
      searchRegionBtn.classList.remove('disabled');
      closeModalBtn.disabled = false;
      closeModalBtn.classList.remove('disabled');
      refreshRegionUI();
    } else {
      puzzleMsg.innerHTML = '<div class="message">Correct! Here is the next puzzle.</div>';
      setTimeout(() => loadPuzzleInModal(regionId), 1500);
    }
  } else {
    state.incorrectAttempts++;
    let incorrectMsg = '<div class="small" style="color:#ff9aa2">Incorrect answer — try again.</div>';
    if (state.incorrectAttempts >= 5) {
      incorrectMsg += '<div class="small" style="margin-top:8px; color:#94a3b8;">Stuck? You can contact the admin for a hint.</div>';
    }
    puzzleMsg.innerHTML = incorrectMsg;
  }
}
function handleSearchFromModal(){
  const regionId = modalBackdrop.dataset.region;
  if(!regionId) return;
  handleSearch(regionId);
}
function handleSearch(regionId){
  const region = REGIONS.find(r=>r.id===regionId);
  if(!region) return;
  if(!regionState[regionId].solved){ 
    puzzleMsg.innerHTML = '<div class="small" style="color:#ff9aa2">You must solve the puzzle before you can search.</div>';
    return;
  }
  if(regionState[regionId].searched){ 
    puzzleMsg.innerHTML = '<div class="small">This region has already been searched.</div>';
    return;
  }
  regionState[regionId].searched = true;
  regionSearched.textContent = 'Yes';
  searchRegionBtn.disabled = true;
  searchRegionBtn.classList.add('disabled');
  refreshRegionUI();
  const collectorId = collectorSelect.value || (players[0]&&players[0].id);
  const collectorName = getPlayerNameById(collectorId);
  if(region.clue===undefined){ 
    puzzleMsg.innerHTML = `<div class="small" style="font-weight:700">Searched by ${collectorName}. NO CLUE FOUND HERE.</div>`;
    return;
  }
  
  const collector = players.find(p => p.id === collectorId);
  if (collector) {
      collector.cluesFound++;
  }
  populatePlayerPills();

  const tile = { id: 'tile-' + Math.random().toString(36).slice(2,8), letter: region.clue, from: region.name, collectedBy: collectorId };
  clues.push(tile);
  renderInventory();
  puzzleMsg.innerHTML = `<div class="message">You found a clue: '${tile.letter}' — collected by ${collectorName}.</div>`;
}
function getPlayerNameById(id){
  const p = players.find(x=>x.id===id);
  return p ? p.name : 'Unknown';
}
function renderInventory(){
  inventoryEl.innerHTML = '';
  for(const t of clues){
    const el = document.createElement('div');
    el.className = 'tile';
    el.draggable = true;
    el.id = t.id;
    el.title = `${t.letter} — from ${t.from} (by ${getPlayerNameById(t.collectedBy)})`;
    el.textContent = t.letter;
    el.addEventListener('dragstart', e => e.dataTransfer.setData('text/plain', t.id));
    inventoryEl.appendChild(el);
  }
}
function renderTray(){
  trayEl.innerHTML = '';
  for(let i=0;i<TRAY_SLOTS;i++){
    const slot = document.createElement('div');
    slot.className = 'slot' + (tray[i] ? ' filled' : '');
    slot.dataset.idx = i;
    slot.textContent = tray[i] || '';
    slot.addEventListener('dragover', (e)=> e.preventDefault());
    slot.addEventListener('drop', (e)=>{
      e.preventDefault();
      const tileId = e.dataTransfer.getData('text/plain');
      placeTileIntoSlot(tileId, parseInt(slot.dataset.idx,10));
    });
    trayEl.appendChild(slot);
  }
}
function placeTileIntoSlot(tileId, slotIndex){
  const tileIndex = clues.findIndex(c=>c.id===tileId);
  if(tileIndex===-1) return;
  if(tray[slotIndex]){
    const nextEmpty = tray.indexOf(null);
    if(nextEmpty === -1){ 
      showAlert('Tray Full', 'The tray is full. You cannot place another tile.', null, null);
      return; 
    }
    slotIndex = nextEmpty;
  }
  const tile = clues.splice(tileIndex,1)[0];
  tray[slotIndex] = tile.letter;
  undoStack.push({action:'placed', tile, slot:slotIndex});
  renderInventory();
  renderTray();
}
function undoLast(){
  if(undoStack.length===0) return;
  const last = undoStack.pop();
  if(last.action === 'placed' && last.tile){
    tray[last.slot] = null;
    clues.push(last.tile);
    renderInventory();
    renderTray();
  }
}
function resetTray() {
    const placedActions = undoStack.filter(a => a.action === 'placed' && a.tile);
    if (placedActions.length === 0) return;
    for (const action of placedActions) {
        clues.push(action.tile);
    }
    tray.fill(null);
    undoStack = [];
    renderInventory();
    renderTray();
}
function tryUnlock(){
  const attempt = tray.join('');
  if(attempt === TARGET){
    endGame(true);
  } else {
    showAlert('Unlock Failed', `Lock refused. Current tray spells: "${attempt || '(empty)'}".`, null, null);
  }
}
function endGame(won){
  if(timerInterval) clearInterval(timerInterval);
  gameStarted = false;
  startBtn.disabled = true; 
  if(won){
    const finalMinutes = Math.floor(secondsElapsed / 60).toString().padStart(2, '0');
    const finalSeconds = (secondsElapsed % 60).toString().padStart(2, '0');
    const finalTime = `${finalMinutes}:${finalSeconds}`;
    const message = `Congratulations! You have escaped in ${finalTime}.`;
    const subscript = "Please tell the admin your game time.";
    showAlert('Congratulations!', message, subscript, null);
  }
}
trayEl.addEventListener('drop', (e)=>{
  e.preventDefault();
  const tileId = e.dataTransfer.getData('text/plain');
  const firstEmpty = tray.indexOf(null);
  if(firstEmpty === -1){ 
    showAlert('Tray Full', 'The tray is full. Please undo a placement first.', null, null);
    return; 
  }
  placeTileIntoSlot(tileId, firstEmpty);
});
trayEl.addEventListener('dragover', e=>e.preventDefault());
function refreshRegionUI(){
  for(const r of REGIONS){
    const sEl = document.getElementById('status-'+r.id);
    if(regionState[r.id].solved) sEl.textContent = '✅ Escaped';
    else sEl.textContent = '🔒 Locked';
    const seEl = document.getElementById('searched-'+r.id);
    seEl.textContent = regionState[r.id].searched ? 'Yes' : 'No';
  }
}
// Initialize the game on load
init();
