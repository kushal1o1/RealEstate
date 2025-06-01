import './list.scss'
import Card from"../card/Card"
import {listData} from"../../lib/dummydata"

function List({posts,canDelete=false}) {
  return (
    <div className='list'>
      {posts.length === 0 && (
        <div className='no-posts'>
          <p>No posts found</p>
        </div>
      )}
      {posts.map(item=>(
        <Card key={item.id} item={item} canDelete={canDelete}/>
      ))}
    </div>
  )
}

export default List;