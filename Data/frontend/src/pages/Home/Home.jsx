import React from "react";
import "../Home/banner.css";
import { Carousel } from "react-bootstrap";
import sliderImg from "../../assets/images/1.avif";
import sliderImg1 from "../../assets/images/2.avif";
const Home = () => {
	return (
		<section className="slider">
			<Carousel variant="dark">
				<Carousel.Item>
					<img
						src={sliderImg}
						className="d-block w-100 slider_img"
						alt="First slide"
					/>
					<Carousel.Caption>
						<div className="slider_des">
							<h5 className="heading">
								SMART PARKING SYSTEM <span>FOR MODERN DRIVERS</span>
							</h5>
							<p className="sub_text">
								Effortlessly manage your parking needs with real-time updates
								and seamless booking options.
							</p>
						</div>
					</Carousel.Caption>
				</Carousel.Item>
				<Carousel.Item>
					<img
						src={sliderImg1}
						className="d-block w-100 slider_img"
						alt="Second slide"
					/>
					<Carousel.Caption>
						<div className="slider_des">
							<h5 className="heading">
								YOUR ULTIMATE SOLUTION <span>TO HASSLE-FREE PARKING</span>
							</h5>
							<p className="sub_text">
								Experience secure and convenient parking with automated services
								and real-time availability.
							</p>
						</div>
					</Carousel.Caption>
				</Carousel.Item>
			</Carousel>
		</section>
	);
};

export default Home;
