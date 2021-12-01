import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import { Popover2 } from "@blueprintjs/popover2";
import "@blueprintjs/popover2/lib/css/blueprint-popover2.css";
import { getTypographyByKey } from "constants/DefaultTheme";

import { Colors } from "constants/Colors";
import { getCurrentAppGitMetaData } from "selectors/applicationSelectors";
import BranchList from "../components/BranchList";
import { fetchBranchesInit } from "actions/gitSyncActions";
import Icon, { IconSize } from "components/ads/Icon";
import Tooltip from "components/ads/Tooltip";
import { Position } from "@blueprintjs/core";
import { isEllipsisActive } from "utils/helpers";

const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
  & .label {
    color: ${(props) => props.theme.colors.editorBottomBar.branchBtnText};
    ${(props) => getTypographyByKey(props, "p1")};
    line-height: 18px;
  }
  & .icon {
    height: 24px;
  }
  margin: 0 ${(props) => props.theme.spaces[4]}px;
  cursor: pointer;
  &:hover svg path {
    fill: ${Colors.CHARCOAL};
  }
  & .label {
    width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

function BranchButton() {
  const gitMetaData = useSelector(getCurrentAppGitMetaData);
  const currentBranch = gitMetaData?.branchName;
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const fetchBranches = () => dispatch(fetchBranchesInit());
  const labelTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchBranches();
  }, []);

  return (
    <Popover2
      content={<BranchList setIsPopupOpen={setIsOpen} />}
      isOpen={isOpen}
      minimal
      modifiers={{ offset: { enabled: true, options: { offset: [7, 10] } } }}
      onInteraction={(nextState: boolean) => {
        setIsOpen(nextState);
      }}
      placement="top-start"
    >
      <Tooltip
        boundary="window"
        content={currentBranch || ""}
        disabled={!isEllipsisActive(labelTarget.current)}
        hoverOpenDelay={1000}
        position={Position.TOP_LEFT}
      >
        <ButtonContainer className="t--branch-button">
          <div className="icon">
            <Icon name="git-branch" size={IconSize.XXXXL} />
          </div>
          <div className="label" ref={labelTarget}>
            {currentBranch}
          </div>
        </ButtonContainer>
      </Tooltip>
    </Popover2>
  );
}

export default BranchButton;
