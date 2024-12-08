import React from "react";
import { BiCheck, BiLoader, BiTimer } from "react-icons/bi";

const PaymentProgress = ({ stage, error, isComplete }) => {
  const stages = [
    {
      id: "creating",
      title: "Creating Payment Requests",
      description: "Generating unique request IDs for each recipient",
    },
    {
      id: "processing",
      title: "Processing Payments",
      description: "Processing batch payments on the blockchain",
    },
    {
      id: "confirm",
      title: "Awaiting Confirmation",
      description:
        "Confirming payment on the blockchain, this may take a few seconds",
    },
    {
      id: "sending-emails",
      title: "Sending Invoice to email",
      description:
        "This can take a minute (the current backend server is free tier, so please be patient) :)",
    },
    {
      id: "complete",
      title: "Payment complete",
      description: "All payments have been processed successfully !",
    },
  ];

  const getStageIndex = (currentStage) => {
    return stages.findIndex((s) => s.id === currentStage);
  };

  // Calculate if a stage is complete based on current stage and isComplete flag
  const isStageComplete = (stageIndex) => {
    if (isComplete) {
      return true; // All stages are complete when isComplete is true
    }
    return getStageIndex(stage) > stageIndex;
  };

  // Calculate if a stage is current
  const isCurrentStage = (stageId, stageIndex) => {
    if (isComplete) {
      return false; // No current stage when complete
    }
    return stageId === stage;
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 p-6">
      {/* Progress Bar */}
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full mb-4">
          <div
            className="h-full bg-blue-500 rounded-full transition-all duration-500 "
            style={{
              width: isComplete
                ? "100%"
                : `${(getStageIndex(stage) / (stages.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Stage Indicators */}
        <div className="top-0 w-full flex justify-between transform -translate-y-1/2">
          {stages.map((s, index) => {
            const isCurrent = isCurrentStage(s.id, index);
            const stageComplete = isStageComplete(index);

            return (
              <div key={s.id} className="flex flex-col items-center">
                <div
                  className={`
                  w-8 h-8 rounded-full flex items-center justify-center
                  ${
                    stageComplete
                      ? "bg-green-500"
                      : isCurrent
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }
                  transition-colors duration-500
                `}
                >
                  {stageComplete ? (
                    <BiCheck className="w-5 h-5 text-white" />
                  ) : isCurrent ? (
                    <BiLoader className="w-5 h-5 text-white animate-spin" />
                  ) : (
                    <BiTimer className="w-5 h-5 text-white" />
                  )}
                </div>
                <div className="absolute mt-10 w-32 text-center">
                  <p className="text-sm font-medium">{s.title}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Status Message */}
      <div className="text-center pt-10">
        {isComplete ? (
          <p className="text-green-600 font-medium">
            All payments have been successfully processed!
          </p>
        ) : (
          <p className="text-gray-600">
            {stages.find((s) => s.id === stage)?.description}
          </p>
        )}
      </div>
    </div>
  );
};

export default PaymentProgress;
