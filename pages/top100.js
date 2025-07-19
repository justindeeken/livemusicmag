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

export default function Top100Page({ data }) {
  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '1rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>{data.title}</h1>
      <p style={{ margin: '1rem 0' }}>{data.description}</p>
      <ol>
        {data.songs?.map((song, index) => (
          <li key={index}>
            #{index + 1} {song.artist} — {song.title} -{song.genre} - {song.key} - {song.chords} - {song.producer} - {song.year}
          </li>
        ))}
      </ol>
      {data.lastUpdated && (
        <p style={{ fontSize: '0.8rem', color: '#888', marginTop: '2rem' }}>
          Last updated: {new Date(data.lastUpdated).toLocaleDateString()}
        </p>
      )}
    </main>
  )
}
