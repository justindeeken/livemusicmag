import { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function AllUserListsPage() {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLists = async () => {
      const snapshot = await getDocs(collection(db, 'lists'));
      const allLists = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLists(allLists);
      setLoading(false);
    };
    fetchLists();
  }, []);

  if (loading) return <p className="p-4">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">All User Top 100 Lists</h1>
      {lists.map((list) => (
        <div key={list.id} className="mb-6 border-b pb-4">
          <h2 className="text-xl font-semibold">{list.listName}</h2>
          <ol className="list-decimal ml-5 mt-2">
            {list.songs.map((song, i) => (
              <li key={i}>{song}</li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  );
}