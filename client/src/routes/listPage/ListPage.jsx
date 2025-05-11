import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { useLoaderData,Await } from "react-router-dom";
import { Suspense } from "react";

function ListPage() {
  const data = useLoaderData();

  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter/>
        <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.postResponse}
        errorElement={<div>Error loading posts</div>}
        >
          {(postResponse) => (postResponse.data.map(item=>(
          <Card key={item.id} item={item}/>
        ))
          )}
        </Await>
        </Suspense>
        {/* {posts.map(item=>(
          <Card key={item.id} item={item}/>
        ))} */}
      </div>
    </div>
    <div className="mapContainer">
       <Suspense fallback={<div>Loading...</div>}>
        <Await resolve={data.postResponse}
        errorElement={<div>Error loading posts</div>}
        >
          {(postResponse) => (
            <Map data={postResponse.data}/>
          )}
   

        </Await>
        </Suspense>
    </div>
  </div>;
}

export default ListPage;