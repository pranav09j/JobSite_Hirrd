import { useUser } from '@clerk/clerk-react'
import React,{useState,useEffect} from 'react'
import { Card, CardTitle, CardHeader, CardContent, CardFooter } from './ui/card'
import { Button } from './ui/button'
import { Trash2Icon, MapPinIcon, HeartIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { deleteJob, saveJobs } from '@/api/apiJobs';
import useFetch from "../hooks/use-fetch"
import { BarLoader } from 'react-spinners';

const JobCard = ({
    job,
    isMyJob = false,
    savedInit = false,
    onJobAction=()=>{},
}) => {

    const [saved, setSaved] = useState(savedInit);

    const {
        fn:fnSavedJobs, 
        data:savedJob,
        loading:loadingSavedJobs,
      }=useFetch(saveJobs,{
        alreadySaved: saved,
      })

    const{user} = useUser()

    const handleSaveJob = async()=>{
        await fnSavedJobs({
            user_id: user.id,
            job_id: job.id,
        })
        onJobAction();
    }

    const handelDeleteJob =async()=>{
        await fnDeleteJob()
        onJobAction()
    }

    const{
        loading: loadingDeleteJob,
        fn: fnDeleteJob,
    } = useFetch(deleteJob,{
        job_id: job.id,
    })

    useEffect(() => {
        if (savedJob !== undefined) setSaved(savedJob?.length > 0);
      }, [savedJob]);

  return (
    <Card className="flex flex-col">
        {loadingDeleteJob && (
             <BarLoader className='mb-4' width={"100%"} color='#36d7b7'/>
        )}
    <CardHeader>
        <CardTitle className="flex justify-between font-bold">{job.title}
        {isMyJob && <Trash2Icon 
        fill='red'
        size={18} 
        className='text-red-300 cursor-pointer'
        onClick={handelDeleteJob}
        />}
        </CardTitle>

    </CardHeader>
    <CardContent>
        <div className="flex justify-between">
            {job.company && <img src={job.company.logo_url} className='h-6'/>}
            <div className="flex gap-2 items-center">
                <MapPinIcon size={15}/> {job.location}
            </div>
        </div>
        <hr />
        {job.description.substring(0,job.description.indexOf("."))}
    </CardContent>
    <CardFooter className="flex gap-2">
        <Link to={`/job/${job.id}`} className='flex-1'>
            <Button variant="secondary" className="w-full">
                More Details
            </Button>
        </Link>

        {!isMyJob && (
            <Button
            variant="outline"
            className="w-15"
            onClick={handleSaveJob}
            disabled={loadingSavedJobs}>

                {saved ? (

                    <HeartIcon size={20} stroke="red" fill='red'/>  
                ):(
                    <HeartIcon size={20} />  
                )
                }
            </Button>
        )}

    </CardFooter>
  </Card>
  )
  
}

export default JobCard
