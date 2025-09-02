/*
  MBASCAPE — Logic File
  - Team of up to 5 players
  - Regions, Puzzles, and Clues are randomized for replayability.
*/

const TARGET_PHRASE = "I ESCAPED YAY";
const TARGET = TARGET_PHRASE.replace(/\s+/g, "");
const TRAY_SLOTS = TARGET.length;
const GAME_SECONDS = 30 * 60; // 30 minutes default

// --- Data Definitions ---
const PUZZLES = [
    { prompt: "What has keys but can’t open locks?", answer: "Piano" },
    { prompt: "The more you take away, the bigger I get.", answer: "Hole" },
    { prompt: "I’m always in front of you but can’t be seen.", answer: "Future" },
    { prompt: "What comes down but never goes up?", answer: "Rain" },
    { prompt: "I’m tall when I’m young and short when I’m old.", answer: "Candle" },
    { prompt: "What belongs to you but is used by everyone else?", answer: "Name" },
    { prompt: "What is 15 + 27?", answer: "42" },
    { prompt: "How many sides does a hexagon have?", answer: "6" },
    { prompt: "Capital of France", answer: "Paris" },
    { prompt: "Largest planet in our solar system", answer: "Jupiter" },
    { prompt: "Unscramble: RDOO", answer: "Door" },
    { prompt: "Opposite of 'Hot'", answer: "Cold" },
    // Add all other puzzles from the previous list here...
];

const REGIONS = [
  {id:"library", name:"Library", clue:"X"}, {id:"academic", name:"Academic Block", clue:"X"},
  {id:"hostel", name:"Hostel", clue:"X"}, {id:"mess", name:"Mess & Cafeteria", clue:"X"},
  {id:"sports", name:"Sports Ground", clue:"X"}, {id:"amphi", name:"Amphitheatre", clue:"X"},
  {id:"lab", name:"Analytics Lab"}, {id:"ground", name:"Open Ground", clue:"X"},
  {id:"seminar", name:"Seminar Hall", clue:"X"}, {id:"library2", name:"Library 2nd Floor"},
  {id:"dorm", name:"Dormitory", clue:"X"}, {id:"classroom", name:"Classroom"},
  {id:"parking", name:"Parking Lot", clue:"X"}, {id:"canteen", name:"Canteen"},
  {id:"auditorium", name:"Auditorium"}, {id:"garden", name:"Campus Garden"},
  {id:"lab2", name:"Data Lab", clue:"X"}, {id:"library3", name:"Library Basement"},
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
let playerCount = 0, timerInterval = null, secondsLeft = GAME_SECONDS;
let tray = Array(TRAY_SLOTS).fill(null), gameStarted = false;

const mapEl = document.getElementById('map'), inventoryEl = document.getElementById('inventory');
const trayEl = document.getElementById('tray'), logEl = document.getElementById('log');
const timerEl = document.getElementById('timer'), startBtn = document.getElementById('startBtn');
const resetBtn = document.getElementById('resetBtn'), playerPills = document.getElementById('playerPills');
const playerCountEl = document.getElementById('playerCount'), modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle'), modalSub = document.getElementById('modalSub');
const puzzlePrompt = document.getElementById('puzzlePrompt'), puzzleAnswer = document.getElementById('puzzleAnswer');
const submitAnswerBtn = document.getElementById('submitAnswer'), puzzleMsg = document.getElementById('puzzleMsg');
const regionStatus = document.getElementById('regionStatus'), regionSearched = document.getElementById('regionSearched');
const searchRegionBtn = document.getElementById('searchRegion'), closeModalBtn = document.getElementById('closeModal');
const collectorSelect = document.getElementById('collectorSelect'), unlockBtn = document.getElementById('unlockBtn');
const undoBtn = document.getElementById('undoBtn'), shuffleBtn = document.getElementById('shuffleBtn');
const trayLabel = document.getElementById('trayLabel');

// --- Core Game Functions ---
function init() {
  // Load players from localStorage
  const playersData = localStorage.getItem('mbascape_players');
  if (playersData) {
    players = JSON.parse(playersData);
    playerCount = players.length;
  } else {
    // If no player data, redirect back to the start page
    alert("No team data found. Returning to team creation screen.");
    window.location.href = 'index.html';
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

  populatePlayerPills();
  populateCollectorSelect();
  renderTray();
  renderInventory();
  updateTimerDisplay();
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
  shuffleBtn.addEventListener('click', shuffleTrayLetters);
}
function populatePlayerPills(){
  playerPills.innerHTML = '';
  for(const p of players) {
    const el = document.createElement('div');
    el.className='player-pill';
    el.textContent = p.name;
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
  secondsLeft = GAME_SECONDS;
  timerInterval = setInterval(()=>{
    secondsLeft--;
    updateTimerDisplay();
    if(secondsLeft<=0){
      clearInterval(timerInterval);
      endGame(false);
    }
  },1000);
  log('Game started. Good luck!');
}
function updateTimerDisplay(){
  const m = Math.floor(secondsLeft/60).toString().padStart(2,'0');
  const s = (secondsLeft%60).toString().padStart(2,'0');
  timerEl.textContent = `${m}:${s}`;
  if(secondsLeft<=60) timerEl.style.color='#ff8a65'; else timerEl.style.color='';
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
function openRegion(regionId){
  if (!gameStarted) {
    alert("Please start the game first!");
    return;
  }
  const region = REGIONS.find(r=>r.id===regionId);
  if(!region) return;
  modalTitle.textContent = region.name;
  const isSolved = regionState[regionId].solved;
  regionStatus.textContent = isSolved ? '✅ Escaped' : '🔒 Locked';
  regionSearched.textContent = regionState[regionId].searched ? 'Yes' : 'No';
  searchRegionBtn.disabled = !isSolved;
  searchRegionBtn.classList.toggle('disabled', !isSolved);
  closeModalBtn.disabled = !isSolved;
  closeModalBtn.classList.toggle('disabled', !isSolved);
  loadPuzzleInModal(regionId);
  modalBackdrop.style.display = 'flex';
  modalBackdrop.dataset.region = regionId;
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
      log(`Region ${region.name} solved.`);
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
  refreshRegionUI();
  const collectorId = collectorSelect.value || (players[0]&&players[0].id);
  const collectorName = getPlayerNameById(collectorId);
  if(region.clue===undefined){ 
    puzzleMsg.innerHTML = `<div class="small" style="font-weight:700">Searched by ${collectorName}. NO CLUE FOUND HERE.</div>`;
    log(`${collectorName} searched ${region.name} but found no clue.`);
    return;
  }
  const tile = { id: 'tile-' + Math.random().toString(36).slice(2,8), letter: region.clue, from: region.name, collectedBy: collectorId };
  clues.push(tile);
  renderInventory();
  puzzleMsg.innerHTML = `<div class="message">You found a clue: '${tile.letter}' — collected by ${collectorName}.</div>`;
  log(`${collectorName} found '${tile.letter}' at ${region.name}.`);
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
    if(nextEmpty === -1){ alert('Tray full.'); return; }
    slotIndex = nextEmpty;
  }
  const tile = clues.splice(tileIndex,1)[0];
  tray[slotIndex] = tile.letter;
  undoStack.push({action:'placed', tile, slot:slotIndex});
  renderInventory();
  renderTray();
  log(`Placed '${tile.letter}' into tray slot ${slotIndex+1}.`);
}
function undoLast(){
  if(undoStack.length===0) return;
  const last = undoStack.pop();
  if(last.action === 'placed' && last.tile){
    tray[last.slot] = null;
    clues.push(last.tile);
    renderInventory();
    renderTray();
    log(`Undo: returned '${last.tile.letter}' to inventory.`);
  }
}
function shuffleTrayLetters(){
  const letters = tray.filter(Boolean);
  shuffleArray(letters);
  tray = Array(TRAY_SLOTS).fill(null);
  for(let i=0;i<letters.length;i++) tray[i] = letters[i];
  undoStack.push({action:'shuffled'});
  renderTray();
  log('Shuffled tray letters.');
}
function tryUnlock(){
  const attempt = tray.join('');
  if(attempt === TARGET){
    endGame(true);
  } else {
    alert(`Lock refused. Current tray spells: "${attempt || '(empty)'}".`);
    log(`Unlock attempt failed: "${attempt}"`);
  }
}
function endGame(won){
  if(timerInterval) clearInterval(timerInterval);
  gameStarted = false;
  startBtn.disabled = true; 
  if(won){
    alert(`🎉 WAY OUT LOCK opened! You escaped: ${TARGET_PHRASE}`);
    log('Team escaped — WIN!');
  } else {
    alert("⏰ Time's up. The team failed to escape.");
    log('Time up — team lost.');
  }
}
function log(msg){
  const t = new Date().toLocaleTimeString();
  const el = document.createElement('div');
  el.className = 'small';
  el.textContent = `[${t}] ${msg}`;
  logEl.prepend(el);
}
trayEl.addEventListener('drop', (e)=>{
  e.preventDefault();
  const tileId = e.dataTransfer.getData('text/plain');
  const firstEmpty = tray.indexOf(null);
  if(firstEmpty === -1){ alert('Tray full. Undo first.'); return; }
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
