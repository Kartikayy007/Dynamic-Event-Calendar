import { Dispatch, SetStateAction, useState, useEffect } from "react";
import { IconType } from "react-icons";
import {
  FiBarChart,
  FiChevronsRight,
  FiDollarSign,
  FiHome,
  FiMonitor,
  FiShoppingCart,
  FiTag,
  FiPlus,
  FiUsers,
} from "react-icons/fi";
import { WiDaySunny, WiSunrise, WiMoonrise } from "react-icons/wi";
import { motion } from "framer-motion";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

type WeatherData = {
  temp: number;
  condition: string;
  city: string;
};

export const Sidebar = () => {
  const [open, setOpen] = useState(true);
  const [selected, setSelected] = useState("Dashboard");

  return (
    <motion.nav
      layout
      className="sticky top-0 h-screen shrink-0 border-r border-slate-300 bg-white p-2"
      style={{
        width: open ? "290px" : "fit-content",
      }}
    >
      <TitleSection open={open} />

      <div className="space-y-1">
        <Option
          Icon={FiPlus}
          title="Create"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />

        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-full"
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateCalendar
                value={dayjs()}
                readOnly
                sx={{
                  width: '100%',
                  '& .MuiPickersDay-root': {
                    fontSize: '0.75rem',
                    borderRadius: '50px',
                    color: 'rgb(107 114 128)',
                    '&:hover': {
                      backgroundColor: 'rgb(238 242 255)',
                      color: 'rgb(79 70 229)'
                    },
                    '&.Mui-selected': {
                      backgroundColor: 'rgb(99 102 241)',
                      color: '#fff',
                      '&:hover': {
                        backgroundColor: 'rgb(79 70 229)'
                      }
                    },
                    '&.MuiPickersDay-today': {
                      border: '2px solid rgb(99 102 241)',
                      color: '#ffff',
                      '&:hover': {
                        backgroundColor: 'rgb(238 242 255)',
                        color: 'rgb(79 70 229)'
                      }
                    }
                  },
                  '& .MuiTypography-root': {
                    fontSize: '0.875rem',
                    color: 'rgb(75 85 99)',
                    fontWeight: 500
                  },
                  '& .MuiPickersCalendarHeader-root': {
                    paddingLeft: '8px',
                    paddingRight: '8px',
                    marginTop: '8px',
                    marginBottom: '8px'
                  },
                  '& .MuiPickersArrowSwitcher-button': {
                    color: 'rgb(99 102 241)',
                    '&:hover': {
                      backgroundColor: 'rgb(238 242 255)'
                    }
                  },
                  '& .MuiDayCalendar-weekDayLabel': {
                    color: 'rgb(107 114 128)',
                    fontWeight: 600
                  }
                }}
              />
            </LocalizationProvider>
          </motion.div>
        )}

        <Option
          Icon={FiDollarSign}
          title="Sales"
          selected={selected}
          setSelected={setSelected}
          open={open}
          notifs={3}
        />
        <Option
          Icon={FiMonitor}
          title="View Site"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiShoppingCart}
          title="Products"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiTag}
          title="Tags"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiBarChart}
          title="Analytics"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
        <Option
          Icon={FiUsers}
          title="Members"
          selected={selected}
          setSelected={setSelected}
          open={open}
        />
      </div>

      <ToggleClose open={open} setOpen={setOpen} />
    </motion.nav>
  );
};

const Option = ({
  Icon,
  title,
  selected,
  setSelected,
  open,
  notifs,
}: {
  Icon: IconType;
  title: string;
  selected: string;
  setSelected: Dispatch<SetStateAction<string>>;
  open: boolean;
  notifs?: number;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setSelected(title)}
      className={`relative flex h-10 w-full items-center rounded-md transition-colors ${selected === title ? "bg-indigo-100 text-indigo-800" : "text-slate-500 hover:bg-slate-100"}`}
    >
      <motion.div
        layout
        className="grid h-full w-10 place-content-center text-lg"
      >
        <Icon />
      </motion.div>
      {open && (
        <motion.span
          layout
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.125 }}
          className="text-xs font-medium"
        >
          {title}
        </motion.span>
      )}

      {notifs && open && (
        <motion.span
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          style={{ y: "-50%" }}
          transition={{ delay: 0.5 }}
          className="absolute right-2 top-1/2 size-4 rounded bg-indigo-500 text-xs text-white"
        >
          {notifs}
        </motion.span>
      )}
    </motion.button>
  );
};

const Weather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeather = async (lat: number, lon: number) => {
      try {
        const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;
        const res = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
        );
        const data = await res.json();
        setWeather({
          temp: Math.round(data.main.temp),
          condition: data.weather[0].main,
          city: data.name
        });
      } catch (err) {
        setError('Failed to fetch weather');
      } finally {
        setLoading(false);
      }
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchWeather(position.coords.latitude, position.coords.longitude);
      },
      () => {
        setError('Location access denied');
        setLoading(false);
      }
    );
  }, []);

  if (loading) return <span className="text-xs text-slate-400">Loading weather...</span>;
  if (error) return null;
  if (!weather) return null;


  return (
    <div className="flex items-center gap-1 ml-4 text-xs text-slate-500">
      <span>{weather.temp}°C • {weather.city}</span>
    </div>
  );
};

const TitleSection = ({ open }: { open: boolean }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();

    if (hour < 12) return (
      <div className="flex items-center gap-2 text-4xl">
        <span >Good Morning</span>
        <WiSunrise className="text-yellow-500 text-6xl" />
      </div>
    );

    if (hour < 17) return (
      <div className="flex items-center gap-2 text-4xl">
        <span>Good Afternoon</span>
        <WiDaySunny className="text-amber-500 text-6xl" />
      </div>
    );

    return (
      <div className="flex items-center gap-2 text-4xl">
        <span >Good Evening</span>
        <WiMoonrise className="text-blue-400 text-6xl" />
      </div>
    );
  };

  return (
    <div className="mb-3 border-b border-slate-300 pb-3">
      <div className="flex cursor-pointer items-center justify-between rounded-md transition-colors hover:bg-slate-100">
        <div className="flex items-center gap-2">
          {open && (
            <motion.div
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.125 }}
            >
              <span className="block text-xs ml-4 font-semibold">
                {getGreeting()}
              </span>
              <Weather />
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const ToggleClose = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  return (
    <motion.button
      layout
      onClick={() => setOpen((pv) => !pv)}
      className="absolute bottom-0 left-0 right-0 border-t border-slate-300 transition-colors hover:bg-slate-100"
    >
      <div className="flex items-center p-2">
        <motion.div
          layout
          className="grid size-10 place-content-center text-lg"
        >
          <FiChevronsRight
            className={`transition-transform ${open && "rotate-180"}`}
          />
        </motion.div>
        {open && (
          <motion.span
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.125 }}
            className="text-xs font-medium"
          >
            Hide
          </motion.span>
        )}
      </div>
    </motion.button>
  );
};