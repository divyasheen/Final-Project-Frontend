import {useContext} from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../contexts/userIdContext'

const CommunityPostPage = () => {
 
    const { community} = useParams()
    console.log('Community ID:', community);
    const{posts}= useContext(UserContext)


    console.log('Posts:', posts);
  const filteredPosts = posts.filter(post => post.community === community);
  console.log('filtered:', filteredPosts);

  return (
    <div>
      {filteredPosts.length > 0 ? <h1>{filteredPosts[0].community}</h1>: <h1>No posts found for this community</h1>}
    </div>
  )
}

export default CommunityPostPage
