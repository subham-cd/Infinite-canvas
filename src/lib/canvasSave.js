import { db } from "./firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";

export const saveCanvas = async (canvasData) => {
  try {
    await setDoc(doc(db, "canvases", "main-canvas"), {
      data: JSON.stringify(canvasData),
      updatedAt: new Date().toISOString()
    });
    return { success: true };
  } catch (error) {
    console.error("Save failed:", error);
    return { success: false };
  }
};

export const loadCanvas = async () => {
  try {
    const docSnap = await getDoc(
      doc(db, "canvases", "main-canvas")
    );
    if (docSnap.exists()) {
      return JSON.parse(docSnap.data().data);
    }
    return null;
  } catch (error) {
    console.error("Load failed:", error);
    return null;
  }
};
