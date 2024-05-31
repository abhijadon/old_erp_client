import { IoBookOutline } from "react-icons/io5";
import { LiaUniversitySolid } from "react-icons/lia";
import { IoMdDoneAll } from "react-icons/io";
import TabsContent from '@/components/TabsContent/TabsContent';
import PermissionAllowed from '@/pages/PermissionAllowed';
import AllSettings from '@/pages/AllSettings';
import Institute from '@/pages/Institute';
import Course from '@/pages/Course';
import Subcourse from '@/pages/Subcourse';
import { MdDensitySmall } from "react-icons/md";
import { BiSolidBookBookmark } from "react-icons/bi";
import useLanguage from '@/locale/useLanguage';

export default function Settings() {
  const translate = useLanguage();


  const content = [
    {
      label: translate('All'),
      icon: <MdDensitySmall />,
      children: <AllSettings />,
    },
    {
      label: translate('Permissions Allowed'),
      icon: <IoMdDoneAll />,
      children: <PermissionAllowed />,
    },
    {
      label: 'Institutes & Universities',
      icon: <LiaUniversitySolid />,
      children: <Institute />,
    },
    {
      label: translate('Courses'),
      icon: <IoBookOutline />,
      children: <Course />,
    },
    {
      label: translate('SubCourse'),
      icon: <BiSolidBookBookmark />,
      children: <Subcourse />,
    },
  ];

  const pageTitle = translate('Settings');

  return <TabsContent content={content} pageTitle={pageTitle} />;
}
