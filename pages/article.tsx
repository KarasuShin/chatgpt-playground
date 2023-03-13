import { MainLayout } from '~/components'
import type { NextPageWithLayout } from './_app'

const Article: NextPageWithLayout = () => <div>article</div>

Article.getLayout = MainLayout

export default Article
