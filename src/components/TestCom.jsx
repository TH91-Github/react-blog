import { collection, doc, getDoc } from "firebase/firestore"
import { fireDB } from "../firebase"
import { useEffect } from "react";

export default function TestCom(){
  
  useEffect(()=> {
    const fetchData = async () => {
      try {
        const db = collection(fireDB, 'velog')
        const docRef = doc(db, "test");
        const data = await getDoc(docRef);
        if (data.exists()) {
          console.log("Document data:", data.data());
        } else {
          console.log("No such document!");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
      }
    }

    fetchData();
  }, []);

  
  return (
    <div className="App">
    	TEST
    </div>
  )
}