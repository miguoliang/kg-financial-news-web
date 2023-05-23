import React from "react";
import { Button, Notification, toast } from "components/ui";
import { themeConfig } from "configs/theme.config";
import { useAppSelector } from "store/hooks";

const CopyButton = () => {
  const theme = useAppSelector((state) => state.theme);

  const handleCopy = () => {
    const config = {
      ...themeConfig,
      ...theme,
      layout: {
        type: theme.layout.type,
        sideNavCollapse: theme.layout.sideNavCollapse,
      },
      panelExpand: false,
    };

    navigator.clipboard.writeText(JSON.stringify(config, null, 2));

    toast.push(
      <Notification title="Copy Success" type="success">
        Please replace themeConfig in 'src/configs/themeConfig.js'
      </Notification>,
      {
        placement: "top-center",
      },
    );
  };

  return (
    <Button block variant="solid" onClick={handleCopy}>
      Copy config
    </Button>
  );
};

export default CopyButton;
