import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container,InputGroup,FormControl,Button,Row,Card } from 'react-bootstrap';
import {useState,useEffect } from 'react'

const CLIENT_ID="4749548648b6470ba9159c49f95f7423";
const CLIENT_SECRET="a515ddd8d742481c93ff6f601c93df16";

function App() {

  const [searchInput,setSearchInput]=useState("");
  const [accessToken,setAccessToken]=useState("");
  const [albums,setAlbums]=useState([]);

  // Api access token
  useEffect(()=>{
    var authParameters={
      method:'POST',
      headers:{
        'Content-Type':'application/x-www-form-urlencoded'
      },
      body:'grant_type=client_credentials&client_id='+CLIENT_ID +'&client_secret='+CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token',authParameters)
    .then(result=>result.json())
    .then(data=>setAccessToken(data.access_token ));
  },[])

  // search

  async function search(){
    console.log("Search for "+ searchInput);

    // get request using search to get the artist id
    var searchParameters={
      method:'GET',
      headers:{
        'Content-type':'application/json',
        'Authorization':'Bearer '+ accessToken
      }
    }
    var artistId=await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist',searchParameters).then(response=>response.json()).then(data=>{return data.artists.items[0].id});

    console.log("Artist id is "+artistId);
    var returnedAlbums=await fetch('https://api.spotify.com/v1/artists/' + artistId + '/albums'+'?inclue_groups=album&market=IN&limit=50',searchParameters)
    .then(response=>response.json())
    .then(data=>{
      console.log(data)
      setAlbums(data.items);
    });
  
  }

  return (
    <div className="App">
       <Container>
        <InputGroup className='mb-3' size='lg'>
          <FormControl placeholder='Search for Artist' type='input' onKeyPress={event=>{
            if(event.key=="Enter"){
              search();
            }
          }}
          onChange={event=>setSearchInput(event.target.value)}
          />
          <Button onClick={search}> Search</Button>
        </InputGroup>
       </Container>
       <Container>
        <Row className='mx-2 row row-cols-4'>
        {albums.map((album,i)=>{
          return(
                <Card>
                  <Card.Img src={album.images[0].url}/>
                  <Card.Body>
                    <Card.Title>
                      {album.name}
                    </Card.Title>
                  </Card.Body>
                </Card>

            )
})}
        
        
        </Row>
       </Container>
    </div>
  );
}

export default App;
