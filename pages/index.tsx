import { MainLayout } from '~/components'
import type { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => <div className="h-full flex items-center justify-center">
  <h1 className="text-5xl ha dark:bg-gradient-to-r dark:from-cyan-400 dark:to-blue-500 dark:bg-clip-text dark:text-transparent leading-normal">ChatGPT Playground</h1>
</div>

Home.getLayout = MainLayout

export default Home

