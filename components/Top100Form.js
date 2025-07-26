import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import Fuse from 'fuse.js';
import { Filter } from 'bad-words';

const filter = new Filter();

export default function Top100Form() {
  const [listName, setListName] = useState('');
  const [songInput, setSongInput] = useState('');
  const [songs, setSongs] = useState([]);
  const [masterSongs, setMasterSongs] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchSongs = async () => {
      const snapshot = await getDocs(collection(db, 'songs'));
      const allSongs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMasterSongs(allSongs);
    };
    fetchSongs();
  }, []);

  const fuse = new Fuse(masterSongs, { keys: ['title'], threshold: 0.3 });

  const handleSongChange = (e) => {
    setSongInput(e.target.value);
    if (e.target.value.length > 2) {
      const results = fuse.search(e.target.value);
      setSuggestions(results.map(r => r.item.title));
    } else {
      setSuggestions([]);
    }
  };

  const handleAddSong = () => {
    if (filter.isProfane(songInput)) {
      setError('Please avoid profanity.');
      return;
    }
    if (songs.length >= 100) {
      setError('List is full. You can only add 100 songs.');
      return;
    }
    setSongs([...songs, songInput]);
    setSongInput('');
    setSuggestions([]);
    setError('');
  };

  const handleSubmit = async () => {
  if (!listName) {
    setError('List name is required.');
    return;
  }
  if (filter.isProfane(listName)) {
    setError('List name contains inappropriate language.');
    return;
  }

  // 🔽 Normalize the list name here
  const normalizedListName = listName.trim().toLowerCase();
  const listRef = doc(db, 'lists', normalizedListName);

  const listSnap = await getDoc(listRef);
  if (listSnap.exists()) {
    setError('That list name already exists. Choose another.');
    return;
  }

  // ✅ Use setDoc instead of addDoc for custom doc ID
  await setDoc(listRef, {
    listName: listName.trim(), // Keep original for display if you want
    songs,
    timestamp: Date.now(),
  });

setSuccessMessage(
  `List saved! You can view your list at /lists/${normalizedListName}`
);
setListName('');
setSongs([]);
};

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Your Top 100 Songs</h1>

      <input
        className="border p-2 w-full mb-2"
        placeholder="List name"
        value={listName}
        onChange={(e) => setListName(e.target.value)}
      />

      <div className="flex mb-2">
        <input
          className="border p-2 flex-1"
          placeholder="Enter song title"
          value={songInput}
          onChange={handleSongChange}
        />
        <button className="bg-blue-500 text-white px-4 ml-2" onClick={handleAddSong}>
          Add
        </button>
      </div>

      {suggestions.length > 0 && (
        <div className="bg-gray-100 border p-2 mb-2">
          <p className="text-sm mb-1">Did you mean:</p>
          <ul>
            {suggestions.map((s, i) => (
              <li key={i} className="text-blue-700 cursor-pointer" onClick={() => setSongInput(s)}>
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}

<ol className="list-decimal ml-4 mb-4">
  {songs.map((s, i) => (
    <li key={i}>
      <span className="font-semibold mr-1">#{i + 1}</span> {s}
    </li>
  ))}
</ol>

<button
  className="bg-green-600 text-white px-6 py-2 rounded"
  onClick={handleSubmit}
  disabled={songs.length === 0}
>
  Submit List
</button>

{error && <p className="text-red-600 mt-2">{error}</p>}

{successMessage && (
  <p className="text-green-700 mt-4">
    ✅ {successMessage}{' '}
    <a
      className="underline text-blue-600"
      href={`/lists/${listName.trim().toLowerCase()}`}
    >
      View it here
    </a>
  </p>
)}

    </div>
  );
}
