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
    { prompt: "What has keys but can’t open locks?", answer: "Piano" }, { prompt: "The more you take away, the bigger I get.", answer: "Hole" }, { prompt: "I’m always in front of you but can’t be seen.", answer: "Future" }, { prompt: "What comes down but never goes up?", answer: "Rain" }, { prompt: "The more you share me, the less I become.", answer: "Secret" }, { prompt: "I’m tall when I’m young and short when I’m old.", answer: "Candle" }, { prompt: "The more of me you take, the more you leave behind.", answer: "Footsteps" }, { prompt: "I have no mouth but can speak, no ears but can hear.", answer: "Echo" }, { prompt: "What begins with T, ends with T, and is filled with T?", answer: "Teapot" }, { prompt: "What belongs to you but is used by everyone else?", answer: "Name" }, { prompt: "I’m full of holes but I can hold water.", answer: "Sponge" }, { prompt: "If two’s company and three’s a crowd, what are four and five?", answer: "Nine" }, { prompt: "Which weighs more, a kilo of cotton or a kilo of iron?", answer: "Equal" }, { prompt: "What gets wetter the more it dries?", answer: "Towel" }, { prompt: "What has a face and hands but no arms or legs?", answer: "Clock" }, { prompt: "The one who makes me, sells me. The one who buys me, never uses me.", answer: "Coffin" }, { prompt: "I fly without wings, I cry without eyes.", answer: "Cloud" }, { prompt: "If you drop me, I’m sure to crack. But give me a smile, and I’ll smile back.", answer: "Mirror" }, { prompt: "What runs but never walks?", answer: "River" }, { prompt: "Which month has 28 days?", answer: "All" }, { prompt: "What is 15 + 27?", answer: "42" }, { prompt: "Half of 100", answer: "50" }, { prompt: "81 divided by 9", answer: "9" }, { prompt: "If today is Monday, what day will it be in 3 days?", answer: "Thursday" }, { prompt: "Next number: 2, 4, 8, 16, ?", answer: "32" }, { prompt: "How many sides does a hexagon have?", answer: "6" }, { prompt: "Convert Roman numeral XV into a number", answer: "15" }, { prompt: "What is 7 squared?", answer: "49" }, { prompt: "Add the first 5 odd numbers", answer: "25" }, { prompt: "If you double 12, subtract 4, what do you get?", answer: "20" }, { prompt: "Capital of France", answer: "Paris" }, { prompt: "Largest planet in our solar system", answer: "Jupiter" }, { prompt: "Which ocean is the largest?", answer: "Pacific" }, { prompt: "Which continent is Egypt in?", answer: "Africa" }, { prompt: "Who wrote “Romeo and Juliet”?", answer: "Shakespeare" }, { prompt: "The fastest land animal", answer: "Cheetah" }, { prompt: "Primary colors are red, blue and…?", answer: "Yellow" }, { prompt: "National animal of India", answer: "Tiger" }, { prompt: "Water’s chemical formula", answer: "H2O" }, { prompt: "Currency of Japan", answer: "Yen" }, { prompt: "Unscramble: RDOO", answer: "Door" }, { prompt: "Unscramble: ETOSN", answer: "Stone" }, { prompt: "Unscramble: TCA", answer: "Cat" }, { prompt: "Which word is missing? 'Black and ____'", answer: "White" }, { prompt: "Opposite of 'Hot'", answer: "Cold" }, { prompt: "Synonym of 'Fast'", answer: "Quick" }, { prompt: "'Happy' is to 'Sad' as 'Big' is to…", answer: "Small" }, { prompt: "Find the hidden word in 'cANDle'", answer: "And" }, { prompt: "Complete: Sun rises in the…", answer: "East" }, { prompt: "Word starting with 'D' and ending with 'G' (hint: pet)", answer: "Dog" }, { prompt: "How many hours in a day?", answer: "24" }, { prompt: "How many days in a leap year?", answer: "366" }, { prompt: "How many minutes in an hour?", answer: "60" }, { prompt: "How many letters in the English alphabet?", answer: "26" }, { prompt: "What is 100 ÷ 25?", answer: "4" }, { prompt: "Multiply 9 × 9", answer: "81" }, { prompt: "What is 1 less than 100?", answer: "99" }, { prompt: "What is 10% of 200?", answer: "20" }, { prompt: "Double of 13", answer: "26" }, { prompt: "3rd prime number", answer: "5" }, { prompt: "Who is Harry Potter’s best friend?", answer: "Ron" }, { prompt: "In “Avengers,” who says “I am Iron Man”?", answer: "Tony" }, { prompt: "What color is Pikachu?", answer: "Yellow" }, { prompt: "Superhero from Gotham City", answer: "Batman" }, { prompt: "Elsa sings which song in Frozen?", answer: "Let It Go" }, { prompt: "First name of Mr. Bean", answer: "Rowan" }, { prompt: "Which company makes iPhones?", answer: "Apple" }, { prompt: "Famous mouse by Disney", answer: "Mickey" }, { prompt: "Famous plumber in Nintendo", answer: "Mario" }, { prompt: "What’s the opposite of Jedi?", answer: "Sith" }, { prompt: "Count the letters in “UNLOCK”", answer: "6" }, { prompt: "Spell the word backwards: 'GAME'", answer: "EMAG" }, { prompt: "How many vowels in 'ESCAPE'?", answer: "3" }, { prompt: "First letter of the alphabet", answer: "A" }, { prompt: "Last letter of 'Puzzle'", answer: "E" }, { prompt: "Middle letter of 'DOOR'", answer: "O" }, { prompt: "Which letter comes after C?", answer: "D" }, { prompt: "Which number looks like an egg?", answer: "0" }, { prompt: "Which number looks like a snake?", answer: "2" }, { prompt: "Which letter looks like a circle?", answer: "O" }, { prompt: "First man on the moon", answer: "Armstrong" }, { prompt: "Longest river in the world", answer: "Nile" }, { prompt: "National sport of Japan", answer: "Sumo" }, { prompt: "Smallest country in the world", answer: "Vatican" }, { prompt: "Instrument with black and white keys", answer: "Piano" }, { prompt: "Shape with 4 equal sides", answer: "Square" }, { prompt: "Which animal is known as 'Ship of the Desert'?", answer: "Camel" }, { prompt: "Opposite of North", answer: "South" }, { prompt: "First month of the year", answer: "January" }, { prompt: "Last day of the week (commonly)", answer: "Sunday" }, { prompt: "How many colors in a rainbow?", answer: "7" }, { prompt: "The color of grass", answer: "Green" }, { prompt: "Sound a dog makes", answer: "Bark" }, { prompt: "How many legs does a spider have?", answer: "8" }, { prompt: "Opposite of day", answer: "Night" }, { prompt: "Complete: Stars and ____", answer: "Stripes" }, { prompt: "Animal that says “Moo”", answer: "Cow" }, { prompt: "A triangle has how many sides?", answer: "3" }, { prompt: "A baby cat is called?", answer: "Kitten" }, { prompt: "Which planet do we live on?", answer: "Earth" },
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

    if (state.solved) {
        modalSub.textContent = state.searched ? "Region Searched" : "Region Escaped";
        puzzlePrompt.textContent = state.searched ? "You have already searched this region for clues." : "You have solved all the puzzles here. You can now search for a clue.";
        puzzleAnswer.style.display = 'none';
        submitAnswerBtn.style.display = 'none';
        searchRegionBtn.disabled = state.searched;
        searchRegionBtn.classList.toggle('disabled', state.searched);
        closeModalBtn.disabled = false;
        closeModalBtn.classList.remove('disabled');
        puzzleMsg.innerHTML = '';
    } else {
        puzzleAnswer.style.display = 'block';
        submitAnswerBtn.style.display = 'block';
        searchRegionBtn.disabled = true;
        searchRegionBtn.classList.add('disabled');
        closeModalBtn.disabled = false;
        closeModalBtn.classList.remove('disabled');
        loadPuzzleInModal(regionId);
    }
}
function closeModal(){ 
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

  if (clues.length === TARGET.length) {
    setTimeout(() => {
        showAlert(
            'All Clues Collected!', 
            'You have found all the letter tiles. Now, find the secret phrase hidden somewhere on this page and arrange the tiles in the final tray to escape!',
            null,
            null
        );
    }, 2000);
  }
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
