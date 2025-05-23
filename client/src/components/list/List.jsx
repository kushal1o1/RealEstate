import './list.scss'
import Card from"../card/Card"
import {listData} from"../../lib/dummydata"

function List({posts,canDelete=false}) {
  return (
    <div className='list'>
      {posts.map(item=>(
        <Card key={item.id} item={item} canDelete={canDelete}/>
      ))}
    </div>
  )
}

export default List;