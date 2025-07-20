import { useState } from 'react'
import { client } from '../lib/sanity'
import { groq } from 'next-sanity'

const query = groq`
  *[_type == "top100Songs"][0] {
    title,
    description,
    songs[] {
      artist,
      title,
      genre,
      key,
      chords,
      producer,
      year
    },
    lastUpdated
  }
`

export async function getStaticProps() {
  const data = await client.fetch(query)
  return {
    props: {
      data
    },
    revalidate: 60 // revalidate every 60 seconds (optional)
  }
}

import { useState } from 'react'

export default function Top100Page({ data }) {
  const [groupBy, setGroupBy] = useState(null)

  const groupSongs = (field) => {
    const grouped = {}
    data.songs.forEach((song) => {
      const key = song[field] || 'Unknown'
      if (!grouped[key]) {
        grouped[key] = []
      }
      grouped[key].push(song)
    })

    return Object.entries(grouped).sort((a, b) => b[1].length - a[1].length)
  }

  const groupedData = groupBy ? groupSongs(groupBy) : null

  return (
    <main style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{data.title}</h1>
      <p style={{ margin: '1rem 0' }}>{data.description}</p>

      <div style={{ marginBottom: '1rem' }}>
        <strong>Group by:</strong>{' '}
        <button onClick={() => setGroupBy('year')}>Year</button>{' '}
        <button onClick={() => setGroupBy('producer')}>Producer</button>{' '}
        <button onClick={() => setGroupBy('key')}>Key</button>{' '}
        <button onClick={() => setGroupBy(null)}>None</button>
      </div>

      {groupedData ? (
        groupedData.map(([groupLabel, songs]) => (
          <div key={groupLabel} style={{ marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.2rem', color: '#333' }}>
              {groupLabel} ({songs.length} song{songs.length !== 1 ? 's' : ''})
            </h2>
            <ul>
              {songs.map((song, i) => (
                <li key={i}>
                  {song.artist} ; <b>{song.title}</b> ; {song.genre} ; {song.key} ; {song.chords} ; {song.producer} ; {song.year}
                </li>
              ))}
            </ul>
          </div>
        ))
      ) : (
        <ol>
          {data.songs?.map((song, index) => (
            <li key={index}>
              #{index + 1} {song.artist} ; <b>{song.title}</b> ; {song.genre} ; {song.key} ; {song.chords} ; {song.producer} ; {song.year}
            </li>
          ))}
        </ol>
      )}

      {data.lastUpdated && (
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '2rem' }}>
          Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
        </p>
      )}
    </main>
  )
}

