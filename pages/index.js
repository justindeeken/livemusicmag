import { client } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
export async function getServerSideProps() {
  const posts = await client.fetch(`*[_type == "post"] | order(publishedAt desc){
    title,
    slug,
    publishedAt,
    body
  }`)
  return { props: { posts } }
}

export default function Home({ posts }) {
  return (
    <main style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
     <header style={{ borderBottom: '2px solid black', marginBottom: '2rem' }}>
  <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem',textAlign: 'center' }}>🎤 Live Music Mag 🎤 </h1>
  <p style={{ color: '#555',textAlign: 'center' }}>THE MUSIC SOURCE</p>
</header>

      {posts.map((post) => (
        <article key={post.slug.current} style={{ marginBottom: '2rem' }}>
          <h2 style={{ 
  fontSize: '2.5rem', // Larger for impact
  fontWeight: 900, // Maximum boldness
  color: '#ff2e63', // Bright pink-red for vibrancy
  textTransform: 'uppercase', // All caps for intensity
  textShadow: '3px 3px 6px rgba(0, 0, 0, 0.5)', // Stronger shadow
  letterSpacing: '0.1em', // Wider spacing for emphasis so much
  marginBottom: '0.5rem' 
}}>
  {post.title}
</h2>
          <p><em>{new Date(post.publishedAt).toLocaleDateString()}</em></p>
          <div style={{ 
            lineHeight: '1.8', 
            fontSize: '1.1rem', 
            marginTop: '1rem', 
            maxWidth: '700px' 
          }}>
            <PortableText value={post.body} />
          </div>
        </article>
      ))}
    </main>
  )
}
