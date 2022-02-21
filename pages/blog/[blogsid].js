import { useRouter } from 'next/router'
import Head from 'next/head'
const Post = () => {
  const router = useRouter()
  const { blogsid } = router.query
  const {blogspath} = router.pathname
  return (
    <Head>
    <title>blogs/{blogsid}</title>
    <meta name="description" content="Generated by create next app" />
    <link rel="icon" href="/favicon.ico" />
  </Head>
  );
}

export default Post