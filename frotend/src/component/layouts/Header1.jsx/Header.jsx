import React, { useEffect, useState } from "react";
import ReorderIcon from "@mui/icons-material/Reorder";
import SearchBar from "./Searchbar";
import "./Header.css";
import { ShoppingCart } from "@material-ui/icons";
import { Badge } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Popover } from "@material-ui/core";
import { Avatar } from "@material-ui/core";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import FlagSelect from "./Flag";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useSelector  , useDispatch} from "react-redux";
import { load_UserProfile } from "../../../actions/userAction";


const useStyles = makeStyles((theme) => ({
  badge: {
    backgroundColor: "#ed1c24",
    color: "#fff",
    "&:hover": {
      backgroundColor: "#ed1c24",
      color: "#fff",
    },
  },
  cartIcon: {
    fontSize: "1.7rem",
    cursor: "pointer",
    marginBottom: theme.spacing(0.8),
  },

  popover: {
    pointerEvents: "none",
  },
  paper: {
    padding: theme.spacing(1),
  },

  avatar: {
    width: theme.spacing(3.5),
    height: theme.spacing(3.5),
    backgroundColor: "white",
    cursor: "pointer",
    color: "#fff",
    marginBottom: theme.spacing(0.8),
    "&:hover": {
      color: "#fff",
    },
    "& .MuiAvatar-colorDefault": {
      backgroundColor: "#000",
    },
  },
  root: {
    "&:hover": {
      color: "#ed1c24",
    },
  },
}));


  // for cartIcon material ui component
function CartIcon({ cartItemCount }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <div>
      <Badge
        badgeContent={cartItemCount}
        color="primary"
        classes={{ badge: classes.badge }}
      >
        <ShoppingCart
          onMouseEnter={handlePopoverOpen}
          onMouseLeave={handlePopoverClose}
          className={classes.cartIcon}
        />
      </Badge>
      {!cartItemCount && (
        <Popover
          className={classes.popover}
          classes={{ paper: classes.paper }}
          open={open}
          anchorEl={anchorEl}
          onClose={handlePopoverClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <div>Cart is empty</div>
        </Popover>
      )}
    </div>
  );
}


// this for profile icon if user login then show image else icon. from material ui. 
function ProfileIcon({ avatarSrc }) {
  const classes = useStyles();
  
  return (
    <Avatar className={classes.avatar} src={avatarSrc}>
      {!avatarSrc && (
        <AccountCircleIcon
          sx={{
            fontSize: 25,
            color: "black",
            "&:hover": {
              color: "#e7070f",
              cursor: "pointer",
            },
          }}
        />
      )}
    </Avatar>
  );
}




// !>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> header Component>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function Header() {
  const history = useHistory();
    const { isAuthenticated, user  , loading} = useSelector((state) => state.userData);

  const { cartItems } = useSelector((state) => state.cart);
  const [searchBarActive, setSearchBarActive] = useState(false);

  const [avatarSrc, setAvatarSrc] = useState(
    "	https://res.cloudinary.com/dliomowgf/image/upload/v1679243168/Avatar/fxolfcwxrwdefvksbrez.jpg"
  );
  const [cartItemCount , setCartItemCount] = useState(0); // this is for cart
  const [country, setCountry] = useState("in"); // this is for flag
  const [sideMenu, setSideMenu] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const dispatch = useDispatch();


 console.log(user);
   
 useEffect(() => {
  
    if(isAuthenticated){
      setAvatarSrc(user.avatar.url)
    }
  
  setCartItemCount(cartItems.length);
   dispatch(load_UserProfile());
 }, [dispatch ,cartItems ]);

  // this is for handle sideBar
  const handleSideBarMenu = () => {
    setSideMenu(!sideMenu);
  };

  // this is for country selection
  const handleCountryChange = (event) => {
    setCountry(event.target.value);
  };

  // this is for Search Button toggle
  const handleSearchButtonClick = () => {
    setSearchBarActive(!searchBarActive);
  };

  // this is for input value of Search bar.
  const handleSearchInputChange = (event) => {
    setSearchValue(event.target.value);
  };

  // this is for handle searching ...
  const handleSearchFormSubmit = (event) => {
    event.preventDefault();
    if (searchValue.trim()) {
      history.push(`/products/${searchValue}`);
    } else {
       history.push("/products");
    }
  };

  // this is for sideBar Toggle Button
  const handleCrossButtonClick = () => {
    setSearchValue("");
    setSearchBarActive(!searchBarActive);
  };

  return (
    <>
      <div className="header">
        <div className="headerTop">
          <div className="headerTopLeft">
            <p>Free Shipping over SGD100</p>
          </div>
          <div className="headerTopRight">
            <div className="headerRetailer">
              <span>
                <LocationOnIcon className="headerRetailer_Svg" />
              </span>
              <span>FIND A RETAILER</span>
            </div>

            <div className="headerFlag">
              <span>
                <FlagSelect value={country} onChange={handleCountryChange} />
              </span>
            </div>

            <div className="headerLogin">
              {isAuthenticated ? (
                <Link
                  to="/account"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <button>My Account</button>
                </Link>
              ) : (
                <Link
                  to="/login"
                  style={{ color: "inherit", textDecoration: "none" }}
                >
                  <button>Sign Up</button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* nav */}
        <div className="headerBottom">
          <div className="headerBottom__logo">
            <div className="header_mobile_menu">
              <span>
                <ReorderIcon
                  onClick={() => setSideMenu(!sideMenu)}
                  sx={{
                    fontSize: 26,
                    color: "black",
                    "&:hover": {
                      color: "#e7070f",
                      cursor: "pointer",
                    },
                  }}
                />
                {sideMenu && (
                  <Sidebar
                    handleSideBarMenu={handleSideBarMenu}
                    isAuthenticated={isAuthenticated}
                    user={user}
                  />
                )}
              </span>
              <span>
                <SearchBar
                  searchBarActive={searchBarActive}
                  searchValue={searchValue}
                  handleCrossButtonClick={handleCrossButtonClick}
                  handleSearchButtonClick={handleSearchButtonClick}
                  handleSearchInputChange={handleSearchInputChange}
                  handleSearchFormSubmit={handleSearchFormSubmit}
                />
              </span>
            </div>
          </div>
          {!searchBarActive && (
            <Link to="/">
              <img
                src={require("../../../Image/logo.png")}
                alt="logo"
                className="headerBottom__logo_main"
              />
            </Link>
          )}

          {/* navmenu */}

          {!searchBarActive && (
            <div className="headerBottom_navMenu">
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>

                <li>
                  <Link to="/products">Product</Link>
                </li>
                <li>
                  <Link to="/contact">Contact</Link>
                </li>
                <li>
                  <Link to="/about_us">About</Link>
                </li>
              </ul>
            </div>
          )}

          {/* icons */}

          <div className="headerBotttom_icons">
            <div className="search_Bar">
              <SearchBar
                searchBarActive={searchBarActive}
                searchValue={searchValue}
                handleCrossButtonClick={handleCrossButtonClick}
                handleSearchButtonClick={handleSearchButtonClick}
                handleSearchInputChange={handleSearchInputChange}
                handleSearchFormSubmit={handleSearchFormSubmit}
              />
            </div>
            <span>
              <Link
                to="/cart"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <CartIcon cartItemCount={cartItemCount} />
              </Link>
            </span>
            <span>
              <Link
                to="/account"
                style={{ color: "inherit", textDecoration: "none" }}
              >
                <ProfileIcon avatarSrc={avatarSrc} />
              </Link>
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;
