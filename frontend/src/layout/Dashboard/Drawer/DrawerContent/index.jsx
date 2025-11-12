// project imports
import SimpleBar from 'components/third-party/SimpleBar';
import Navigation from './Navigation';

// ==============================|| DRAWER CONTENT ||============================== //

export default function DrawerContent() {
  // const { menuMaster } = useGetMenuMaster();
  // const drawerOpen = menuMaster.isDashboardDrawerOpened;

  return (
    <>
      <SimpleBar sx={{ '& .simplebar-content': { display: 'flex', flexDirection: 'column' } }}>
        <Navigation />
        {/* {drawerOpen && <NavCard />} */}
      </SimpleBar>
    </>
  );
}
