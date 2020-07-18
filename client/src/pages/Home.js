import React from 'react';
import Header from "../components/Header/Header";
import '../App.css';
import { Container, Row } from 'react-bootstrap';
import TopTenButtons from '../components/TopTenButtons/TopTenButtons';
import MobileInputStateDropdown from '../components/MobileInput/MobileInputStateDropdown';
import ChartContextProvider from "../components/contextProviders/ChartContextProvider";
import USAMap from '../components/USAMap';
import useWindowSize from "../hooks/useWindowSize";
import ChartContainer from "../components/ChartContainer";
import ScrollUpButton from "react-scroll-up-button";

  function Home() {
  const { width} = useWindowSize();
  return (
    <div className="App">
      <div className="container-fluid">
        <Header/>
      </div>
      <div className="container-lg">
      <ScrollUpButton />
      <Container fluid>
        <ChartContextProvider>
        <>
        { width > 750 ? 
        <div className="container-lg">
          <div className="row mx-auto">
            <div className="col-12 col-md-10">
              <TopTenButtons />
            </div>
          </div>
          <div className="row mx-auto">
            <div className="col-12 col-md-10 ">
              <USAMap/>
            </div>
          </div>
        </div>
        : <Row>
            < MobileInputStateDropdown />
          </Row>
        } 
        <ChartContainer>
        </ChartContainer>
        </>
        </ChartContextProvider>
      </Container>
    </div>
    </div>
  );
}

export default Home;
