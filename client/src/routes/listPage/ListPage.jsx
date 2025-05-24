import { listData } from "../../lib/dummydata";
import "./listPage.scss";
import Filter from "../../components/filter/Filter"
import Card from "../../components/card/Card"
import Map from "../../components/map/Map";
import { useLoaderData,Await } from "react-router-dom";
import { Suspense } from "react";
import { useToast } from '../../context/ToastContext.jsx';
import { useEffect } from 'react';
import Loader from "../../components/loader/Loader";


function ListPage() {
  const data = useLoaderData();
  const { showToast } = useToast();
    useEffect(() => {
      showToast('You can play around  Map to get locations', 'success');
    }, [showToast]);
  
  return <div className="listPage">
    <div className="listContainer">
      <div className="wrapper">
        <Filter/>
        <Suspense fallback={<Loader message="Loading Posts..." />}>
        <Await resolve={data.postResponse}
        errorElement={<Loader message="Error loading posts" />}
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
       <Suspense fallback={<Loader message="Loading Map..." />}>
        <Await resolve={data.postResponse}
        errorElement={<Loader message="Error loading map" />}
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