import Placeholder from "./js/placeholder";
import Slider from "./js/slider";
import Scroll from "./js/scroll";
import {instances} from "./js/store";

instances.scroll = new Scroll();
instances.scroll.init();

instances.slider = new Slider();
instances.slider.init();

const placeholder = new Placeholder();
placeholder.init();