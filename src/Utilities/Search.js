import {alpha, InputBase, styled} from "@mui/material";
import Utilities from "./Utilities";

export const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0),
    '&:hover': {
        backgroundColor: alpha(Utilities.isDarkMode ? theme.palette.common.white : theme.palette.common.black, 0.03),
    },
    border: 'solid gray 0.5px',
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

export const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: Utilities.isDarkMode ? 'white' : 'black',
    width: '100%',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        background: 'transparent',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
        '@media(max-width: 965px)': {
            '&:focus': {
                width: '12ch',
            },
        }
    },
}));

export const SearchIconWrapperEnd = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    top: 0,
    right: 0,
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

export const SearchMobile = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0),
    '&:hover': {
        backgroundColor: alpha(Utilities.isDarkMode ? theme.palette.common.white : theme.palette.common.black, 0.03),
    },
    border: 'solid gray 0.5px',
    marginLeft: 0,
    width: '100%',
}));
