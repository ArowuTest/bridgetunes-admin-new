import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import DatePicker from "react-datepicker"; // Import DatePicker
import "react-datepicker/dist/react-datepicker.css"; // Import default styles
import { FaCalendarAlt, FaTrophy, FaPlay, FaFilter } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify"; // Import toast
import "react-toastify/dist/ReactToastify.css"; // Import toast styles
import { PageLayout } from "../components/PageLayout";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal"; // Assuming a Modal component exists
import { StatusBadge } from "../components/StatusBadge"; // Assuming a StatusBadge component exists
import { getDraws, executeDraw, scheduleDraw, getPrizeStructure, updatePrizeStructure } from "../services/draw.service"; // Assuming these API functions exist
import { Draw, PrizeStructure, Winner } from "../types/draw.types"; // Assuming these types exist

// Helper function to get day name (e.g., "Monday")
const getDayOfWeekName = (dayIndex: number): string => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex];
};

// Helper function to get day index (0=Sun, 1=Mon, ...)
const getDayOfWeekIndex = (year: number, month: number, day: number): number => {
    // Month is 0-indexed in JS Date (0=Jan, 1=Feb, ...)
    return new Date(year, month, day).getDay();
};

// Helper function to get recommended digits based on day
const getRecommendedDigits = (dayName: string): number[] => {
    switch (dayName) {
        case "Monday": return [0, 1];
        case "Tuesday": return [2, 3];
        case "Wednesday": return [4, 5];
        case "Thursday": return [6, 7];
        case "Friday": return [8, 9];
        case "Saturday": return [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]; // All digits
        default: return []; // Sunday or invalid
    }
};

// Helper function for notifications
const showNotification = (type: "success" | "error" | "info", message: string) => {
    switch (type) {
        case "success":
            toast.success(message);
            break;
        case "error":
            toast.error(message);
            break;
        case "info":
            toast.info(message);
            break;
        default:
            toast(message);
    }
};

// Type for draw stage
type DrawStage = "idle" | "loading" | "spinning" | "revealing" | "complete" | "error";

// Styled Components (Refine as needed)
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const AdminButtons = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-bottom: 20px;
`;

const DrawConfigArea = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  background-color: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
`;

const ConfigSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const DigitSelector = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  button {
    padding: 5px 10px;
    border: 1px solid #ccc;
    background-color: white;
    cursor: pointer;
    border-radius: 4px;
    &.selected {
      background-color: #007bff;
      color: white;
      border-color: #007bff;
    }
  }
`;

const PrizeDisplay = styled.div`
  background-color: #e9ecef;
  padding: 15px;
  border-radius: 8px;
  h4 {
    margin-top: 0;
    margin-bottom: 10px;
  }
  p {
    margin: 5px 0;
  }
`;

const ExecuteButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const WinnerDisplay = styled.div`
  margin-top: 30px;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
`;

// --- Component --- 

const DrawManagementRefactored: React.FC = () => {
    // API function wrappers (with error handling)
    const apiGetPrizeStructure = async (type: "DAILY" | "SATURDAY"): Promise<PrizeStructure> => {
        // Simplified - add proper error handling/typing if service returns complex object
        return getPrizeStructure({ draw_type: type }); 
    };
    const apiUpdatePrizeStructure = async (id: string, data: Partial<PrizeStructure>) => {
        return updatePrizeStructure(id, data);
    };
    const apiScheduleDraw = async (data: any) => { // Replace any
        return scheduleDraw(data);
    };
    const apiExecuteDraw = async (drawId: string) => {
        return executeDraw(drawId);
    };

    // State variables based on prototype and requirements
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // Default to today
    const [selectedDigits, setSelectedDigits] = useState<number[]>([]);
    const [currentPrizeStructure, setCurrentPrizeStructure] = useState<PrizeStructure | null>(null);
    // Remove rolloverAmount state, get it from selectedDrawDetails
    // const [rolloverAmount, setRolloverAmount] = useState<number>(0);
    const [scheduledDraws, setScheduledDraws] = useState<Draw[]>([]); // Full list for finding draw ID
    const [selectedDrawDetails, setSelectedDrawDetails] = useState<Draw | null>(null); // Details for the selected date
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [drawStage, setDrawStage] = useState<DrawStage>("idle");
    
    const [winners, setWinners] = useState<Winner[]>([]);
    const [jackpotWinner, setJackpotWinner] = useState<Winner | null>(null);

    // State for Modals
    const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
    const [scheduleFormData, setScheduleFormData] = useState({ drawDate: "", drawType: "DAILY" }); // State for schedule form
    const [isEditDailyModalOpen, setIsEditDailyModalOpen] = useState(false);
    const [isEditSaturdayModalOpen, setIsEditSaturdayModalOpen] = useState(false);
    const [prizeStructureToEdit, setPrizeStructureToEdit] = useState<PrizeStructure | null>(null);
    // Add state for the edit form fields to make them controlled
    const [editFormState, setEditFormState] = useState<Partial<PrizeStructure>>({});

    // --- Derived State --- 
    const selectedYear = selectedDate?.getFullYear();
    const selectedMonth = selectedDate?.getMonth(); // 0-indexed
    const selectedDay = selectedDate?.getDate();
    const dayName = selectedDate ? getDayOfWeekName(selectedDate.getDay()) : "";

    // --- Effects --- 

    // Effect to update details when date changes
    useEffect(() => {
        if (selectedDate) {
            const fetchDetails = async () => {
                setIsLoading(true);
                setError(null);
                setSelectedDrawDetails(null); // Clear previous details
                try {
                    const dayIndex = selectedDate.getDay();
                    const currentDayName = getDayOfWeekName(dayIndex);
                    const recommended = getRecommendedDigits(currentDayName);
                    setSelectedDigits(recommended); // Auto-select recommended digits

                    const saturdayCheck = currentDayName === "Saturday";
                    const drawType = saturdayCheck ? "SATURDAY" : "DAILY";
                    // Use the corrected API call with draw_type
                    const structure = await apiGetPrizeStructure(drawType);
                    setCurrentPrizeStructure(structure);

                    // Find the scheduled draw for the selected date to get rollover
                    const dateString = selectedDate.toISOString().split("T")[0];
                    const drawDetails = scheduledDraws.find(draw => 
                        draw.drawDate.startsWith(dateString) && draw.status === "scheduled"
                    );
                    setSelectedDrawDetails(drawDetails || null);

                } catch (err: any) {
                    console.error("Error fetching prize structure or draw details:", err);
                    setError(err.message || "Failed to fetch prize structure or draw details.");
                    setCurrentPrizeStructure(null);
                    setSelectedDrawDetails(null);
                } finally {
                    setIsLoading(false);
                }
            };
            fetchDetails();
        } else {
            // Clear details if no date is selected
            setSelectedDigits([]);
            setCurrentPrizeStructure(null);
            setSelectedDrawDetails(null);
        }
    }, [selectedDate, scheduledDraws]); // Add scheduledDraws dependency

    // Effect to fetch scheduled draws (needed to find draw ID for execution)
    useEffect(() => {
        const fetchScheduledDraws = async () => {
            try {
                // Assuming getDraws can filter by status or returns all
                const allDraws = await getDraws({}); 
                setScheduledDraws(allDraws.filter((d: Draw) => d.status === "scheduled"));
            } catch (err) {
                console.error("Failed to fetch scheduled draws:", err);
                // Handle error appropriately
            }
        };
        fetchScheduledDraws();
    }, []); // Fetch once on mount

    // --- Handlers --- 
    const handleDateChange = (date: Date | null) => {
        setSelectedDate(date);
    };

    const handleDigitToggle = (digit: number) => {
        setSelectedDigits(prev => 
            prev.includes(digit) ? prev.filter(d => d !== digit) : [...prev, digit]
        );
    };

    const handleSelectAllDigits = () => {
        setSelectedDigits([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    };

    const handleClearDigits = () => {
        setSelectedDigits([]);
    };

    const handleExecuteDraw = async () => {
        if (!selectedDate) {
            setError("Please select a draw date.");
            return;
        }
        if (selectedDigits.length === 0) {
            setError("Please select at least one eligible digit.");
            return;
        }

        // Find the scheduled draw matching the selected date
        const dateString = selectedDate.toISOString().split("T")[0]; // Format as YYYY-MM-DD
        const drawToExecute = scheduledDraws.find(draw => 
            draw.drawDate.startsWith(dateString) && draw.status === "scheduled"
        );

        if (!drawToExecute) {
            setError(`No scheduled draw found for ${dateString}. Please schedule one first.`);
            return;
        }

        setIsLoading(true);
        setError(null);
        setDrawStage("loading");
        setWinners([]);
        setJackpotWinner(null);

        try {
            // TODO: Implement spinning animation component here
            setDrawStage("spinning");
            await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate spinning

            // Execute the draw using the found draw ID
            const result = await apiExecuteDraw(drawToExecute.id);
            
            // TODO: Implement revealing animation component here
            setDrawStage("revealing");
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate reveal delay

            // Assuming API returns winners array, find jackpot winner
            const allWinners: Winner[] = result.winners || []; // Adjust based on actual API response
            const jackpot = allWinners.find(w => w.prizeTier === "Jackpot"); // Adjust prizeTier name if needed
            
            setWinners(allWinners);
            setJackpotWinner(jackpot || null);
            setDrawStage("complete");

            // Refresh scheduled draws list after execution
            const updatedDraws = await getDraws({}); 
            setScheduledDraws(updatedDraws.filter(d => d.status === "scheduled"));

        } catch (err: any) {
            console.error("Error executing draw:", err);
            const apiError = err.response?.data?.message || err.message || "Failed to execute draw.";
            setError(`Failed to execute draw ${drawToExecute.id}: ${apiError} (Status: ${err.response?.status || "N/A"})`);
            setDrawStage("error");
        } finally {
            setIsLoading(false);
        }
    };

    // --- More handlers needed for modals, prize updates etc. --- 

    const openEditPrizeModal = async (type: "DAILY" | "SATURDAY") => {
        setIsLoading(true);
        setError(null);
        try {
            const structure = await apiGetPrizeStructure(type);
            setPrizeStructureToEdit(structure); // Keep original structure for reference/ID
            setEditFormState({ // Populate form state
                jackpot: structure.jackpot,
                second: structure.second,
                third: structure.third,
                consolation: structure.consolation,
                consolationCount: structure.consolationCount,
            });
            if (type === "DAILY") {
                setIsEditDailyModalOpen(true);
            } else {
                setIsEditSaturdayModalOpen(true);
            }
        } catch (err: any) {
            console.error(`Error fetching ${type} prize structure for edit:`, err);
            setError(err.message || `Failed to fetch ${type} prize structure.`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePrizeStructure = async () => {
        if (!prizeStructureToEdit) return;
        setIsLoading(true);
        setError(null);
        try {
            // Construct the payload using the ID from the original structure and data from the form state
            const payload: PrizeStructure = {
                ...prizeStructureToEdit, // Keep ID, type, etc.
                jackpot: editFormState.jackpot || 0,
                second: editFormState.second || 0,
                third: editFormState.third || 0,
                consolation: editFormState.consolation || 0,
                consolationCount: editFormState.consolationCount || 0,
            };
            await apiUpdatePrizeStructure(prizeStructureToEdit.id, payload);
            // Close modals and potentially refresh structure display
            setIsEditDailyModalOpen(false);
            setIsEditSaturdayModalOpen(false);
            setPrizeStructureToEdit(null);
            setEditFormState({}); // Clear form state
            // Re-fetch current structure if it was the one edited
            if (selectedDate) {
                const dayIndex = selectedDate.getDay();
                const isSat = getDayOfWeekName(dayIndex) === "Saturday";
                const currentType = isSat ? "SATURDAY" : "DAILY";
                if (payload.type === currentType) { // Check against payload type
                    const structure = await apiGetPrizeStructure(currentType);
                    setCurrentPrizeStructure(structure);
                }
            }
            // alert("Prize structure updated successfully!"); // Replace with better notification
            showNotification("success", "Prize structure updated successfully!");
        } catch (err: any) {
            console.error("Error updating prize structure:", err);
            const apiError = err.message || "Failed to update prize structure.";
            setError(apiError);
            showNotification("error", apiError);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScheduleDraw = async (formData: typeof scheduleFormData) => { 
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Validate formData (e.g., ensure date is selected)
            if (!formData.drawDate) {
                throw new Error("Draw date is required.");
            }
            const payload = {
                drawDate: new Date(formData.drawDate).toISOString(), // Ensure ISO format
                type: formData.drawType,
                // Add any other required fields from API spec
            };
            await apiScheduleDraw(payload);
            setIsScheduleModalOpen(false);
            setScheduleFormData({ drawDate: "", drawType: "DAILY" }); // Reset form
            // Refresh scheduled draws list
            const updatedDraws = await getDraws({}); 
            setScheduledDraws(updatedDraws.filter(d => d.status === "scheduled"));
            // alert("Draw scheduled successfully!"); // Replace with better notification
            showNotification("success", "Draw scheduled successfully!");
        } catch (err: any) {
            console.error("Error scheduling draw:", err);
             // Check if the error response has more details
            const apiError = err.response?.data?.message || err.message || "Failed to schedule draw.";
            setError(`Failed to schedule draw: ${apiError} (Status: ${err.response?.status || "N/A"})`);
            showNotification("error", `Failed to schedule draw: ${apiError}`);
            // Keep modal open on error?
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <PageLayout title="Draw Management">
            <ToastContainer /> {/* Add ToastContainer here */}
            <Container>
                {/* Admin Buttons (Edit Prizes, Schedule) - Placed at top-right */} 
                <AdminButtons>
                    <Button 
                        variant="warning" 
                        onClick={() => openEditPrizeModal("DAILY")}
                        icon={<FaTrophy />}
                    >
                        Edit Daily Prizes
                    </Button>
                    <Button 
                        variant="warning" 
                        onClick={() => openEditPrizeModal("SATURDAY")}
                        icon={<FaTrophy />}
                    >
                        Edit Saturday Prizes
                    </Button>
                    <Button 
                        variant="primary" 
                        onClick={() => setIsScheduleModalOpen(true)}
                        icon={<FaCalendarAlt />}
                    >
                        Schedule New Draw
                    </Button>
                </AdminButtons>

                {/* Main Draw Configuration Area */} 
                <DrawConfigArea>
                    {/* Date Selection */} 
                    <ConfigSection>
                        <label htmlFor="drawDate">Select Draw Date:</label>
                        <DatePicker 
                            selected={selectedDate}
                            onChange={handleDateChange}
                            dateFormat="yyyy/MM/dd"
                            id="drawDate"
                            // Add any other desired props (minDate, maxDate, etc.)
                        />
                        {dayName && <p>Day: {dayName}</p>}
                    </ConfigSection>

                    {/* Digit Selection */} 
                    <ConfigSection>
                        <label>Eligible Ending Digits:</label>
                        <DigitSelector>
                            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(digit => (
                                <button 
                                    key={digit} 
                                    onClick={() => handleDigitToggle(digit)}
                                    className={selectedDigits.includes(digit) ? "selected" : ""}
                                >
                                    {digit}
                                </button>
                            ))}
                        </DigitSelector>
                        <div>
                            <Button onClick={handleSelectAllDigits} size="small" variant="secondary">Select All</Button>
                            <Button onClick={handleClearDigits} size="small" variant="secondary">Clear</Button>
                        </div>
                    </ConfigSection>

                    {/* Prize Structure Display */} 
                    <ConfigSection>
                        <label>Prize Structure ({currentPrizeStructure?.type || "N/A"}):</label>
                        {isLoading && <p>Loading structure...</p>} {/* Added loading indicator */}
                        {!isLoading && currentPrizeStructure ? (
                            <PrizeDisplay>
                                <h4>{currentPrizeStructure.type} Prizes</h4>
                                <p>Jackpot: ₦{currentPrizeStructure.jackpot?.toLocaleString()}</p>
                                <p>Second: ₦{currentPrizeStructure.second?.toLocaleString()}</p>
                                <p>Third: ₦{currentPrizeStructure.third?.toLocaleString()}</p>
                                <p>Consolation: ₦{currentPrizeStructure.consolation?.toLocaleString()} (x{currentPrizeStructure.consolationCount})</p>
                                {/* Use rollover from selectedDrawDetails */} 
                                <p><strong>Rollover: ₦{(selectedDrawDetails?.rollover || 0).toLocaleString()}</strong></p> 
                            </PrizeDisplay>
                        ) : (
                            !isLoading && <p>Select a date to view prize structure.</p>
                        )}
                    </ConfigSection>
                </DrawConfigArea>

                {/* Execute Draw Button */} 
                <ExecuteButtonContainer>
                    <Button 
                        variant="success" 
                        size="large" 
                        onClick={handleExecuteDraw} 
                        disabled={isLoading || drawStage === "spinning" || drawStage === "revealing" || !selectedDate || selectedDigits.length === 0}
                        icon={<FaPlay />}
                    >
                        {isLoading ? "Processing..." : "Execute Draw"}
                    </Button>
                </ExecuteButtonContainer>

                {/* Error Display */} 
                {error && <p style={{ color: "red", textAlign: "center" }}>Error: {error}</p>}

                {/* Winner Display Area */} 
                {(drawStage === "spinning" || drawStage === "revealing" || drawStage === "complete") && (
                    <WinnerDisplay>
                        {drawStage === "spinning" && <p>Spinning Animation Component Here...</p>} 
                        {drawStage === "revealing" && <p>Revealing Animation Component Here...</p>} 
                        {drawStage === "complete" && (
                            <>
                                <h3>Draw Complete!</h3>
                                {jackpotWinner ? (
                                    <div>
                                        <h4>Jackpot Winner!</h4>
                                        {/* Mask MSISDN: Show first 3 and last 3 digits */}
                                        <p>MSISDN: {jackpotWinner.msisdn.substring(0, 3)}...{jackpotWinner.msisdn.substring(jackpotWinner.msisdn.length - 3)}</p> 
                                        <p>Prize: ₦{jackpotWinner.prizeAmount?.toLocaleString()}</p>
                                        {/* TODO: Add other winner details like opt-in status if available */}
                                    </div>
                                ) : (
                                    <p>No Jackpot winner found.</p>
                                )}
                                {winners.length > (jackpotWinner ? 1 : 0) && (
                                    <div>
                                        <h4>Other Winners ({winners.filter(w => w.id !== jackpotWinner?.id).length}):</h4>
                                        <ul style={{ listStyle: "none", padding: 0, maxHeight: "200px", overflowY: "auto" }}>
                                            {winners.filter(w => w.id !== jackpotWinner?.id).map(w => (
                                                <li key={w.id} style={{ borderBottom: "1px solid #eee", padding: "5px 0" }}>
                                                    {w.msisdn.substring(0, 3)}...{w.msisdn.substring(w.msisdn.length - 3)} - {w.prizeTier} (₦{w.prizeAmount?.toLocaleString()})
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </>
                        )}
                    </WinnerDisplay>
                )}

                {/* Modals */} 
                <Modal 
                    isOpen={isScheduleModalOpen} 
                    onClose={() => setIsScheduleModalOpen(false)} 
                    title="Schedule New Draw"
                >
                    {/* Schedule Draw Form Implementation */}
                    <div>
                        <label>Draw Date: 
                            <input 
                                type="datetime-local" 
                                value={scheduleFormData.drawDate}
                                onChange={e => setScheduleFormData({...scheduleFormData, drawDate: e.target.value})}
                            />
                        </label>
                        <label>Draw Type: 
                            <select 
                                value={scheduleFormData.drawType}
                                onChange={e => setScheduleFormData({...scheduleFormData, drawType: e.target.value as ("DAILY" | "SATURDAY")})}
                            > 
                                <option value="DAILY">Daily</option>
                                <option value="SATURDAY">Saturday</option>
                            </select>
                        </label>
                        {/* Add other necessary fields based on API requirements */}
                        <Button onClick={() => handleScheduleDraw(scheduleFormData)} variant="primary" disabled={isLoading}>{isLoading ? "Scheduling..." : "Schedule"}</Button> 
                        <Button onClick={() => setIsScheduleModalOpen(false)} variant="secondary">Cancel</Button>
                    </div>
                    {error && <p style={{ color: "red" }}>Error: {error}</p>} {/* Show error within modal */} 
                </Modal>

                <Modal 
                    isOpen={isEditDailyModalOpen} 
                    onClose={() => setIsEditDailyModalOpen(false)} 
                    title="Edit Daily Prize Structure"
                >
                    {/* Edit Prize Form Implementation */}
                    {prizeStructureToEdit && prizeStructureToEdit.type === "DAILY" && (
                        <div>
                            {/* Use controlled components */}
                            <label>Jackpot: <input type="number" value={editFormState.jackpot || ""} onChange={e => setEditFormState({...editFormState, jackpot: parseInt(e.target.value) || 0})} /></label>
                            <label>Second: <input type="number" value={editFormState.second || ""} onChange={e => setEditFormState({...editFormState, second: parseInt(e.target.value) || 0})} /></label>
                            <label>Third: <input type="number" value={editFormState.third || ""} onChange={e => setEditFormState({...editFormState, third: parseInt(e.target.value) || 0})} /></label>
                            <label>Consolation: <input type="number" value={editFormState.consolation || ""} onChange={e => setEditFormState({...editFormState, consolation: parseInt(e.target.value) || 0})} /></label>
                            <label>Consolation Count: <input type="number" value={editFormState.consolationCount || ""} onChange={e => setEditFormState({...editFormState, consolationCount: parseInt(e.target.value) || 0})} /></label>
                            <Button onClick={handleUpdatePrizeStructure} variant="primary" disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
                            <Button onClick={() => setIsEditDailyModalOpen(false)} variant="secondary">Cancel</Button>
                        </div>
                    )}
                    {error && <p style={{ color: "red" }}>Error: {error}</p>} {/* Show error within modal */} 
                </Modal>

                <Modal 
                    isOpen={isEditSaturdayModalOpen} 
                    onClose={() => setIsEditSaturdayModalOpen(false)} 
                    title="Edit Saturday Prize Structure"
                >
                    {/* Edit Prize Form Implementation */}
                     {prizeStructureToEdit && prizeStructureToEdit.type === "SATURDAY" && (
                        <div>
                            {/* Use controlled components */}
                            <label>Jackpot: <input type="number" value={editFormState.jackpot || ""} onChange={e => setEditFormState({...editFormState, jackpot: parseInt(e.target.value) || 0})} /></label>
                            <label>Second: <input type="number" value={editFormState.second || ""} onChange={e => setEditFormState({...editFormState, second: parseInt(e.target.value) || 0})} /></label>
                            <label>Third: <input type="number" value={editFormState.third || ""} onChange={e => setEditFormState({...editFormState, third: parseInt(e.target.value) || 0})} /></label>
                            <label>Consolation: <input type="number" value={editFormState.consolation || ""} onChange={e => setEditFormState({...editFormState, consolation: parseInt(e.target.value) || 0})} /></label>
                            <label>Consolation Count: <input type="number" value={editFormState.consolationCount || ""} onChange={e => setEditFormState({...editFormState, consolationCount: parseInt(e.target.value) || 0})} /></label>
                            <Button onClick={handleUpdatePrizeStructure} variant="primary" disabled={isLoading}>{isLoading ? "Saving..." : "Save Changes"}</Button>
                            <Button onClick={() => setIsEditSaturdayModalOpen(false)} variant="secondary">Cancel</Button>
                        </div>
                    )}
                    {error && <p style={{ color: "red" }}>Error: {error}</p>} {/* Show error within modal */} 
                </Modal>

            </Container>
        </PageLayout>
    );
};

export default DrawManagementRefactored;




