import Head from 'next/head'
import Sequencer from '../components/sequencer'

export default function Home() {
  return (
    <div className="container">
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
        <script type="text/javascript" src="https://webtiming.github.io/timingsrc/lib/timingsrc-v2.js"></script>
      </Head>

      <main>
        <Sequencer />
      </main>
    </div>
  )
}
