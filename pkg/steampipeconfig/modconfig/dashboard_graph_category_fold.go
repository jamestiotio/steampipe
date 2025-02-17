package modconfig

import (
	"github.com/turbot/steampipe/pkg/utils"
)

type DashboardGraphCategoryFold struct {
	Title     *string `cty:"title" hcl:"title" json:"title,omitempty"`
	Threshold int     `cty:"threshold" hcl:"threshold" json:"threshold,omitempty"`
	Icon      *string `cty:"icon" hcl:"icon" json:"icon,omitempty"`
}

func (f DashboardGraphCategoryFold) Equals(other *DashboardGraphCategoryFold) bool {
	if other == nil {
		return false
	}

	return utils.SafeStringsEqual(f.Title, other.Title) &&
		f.Threshold == other.Threshold &&
		utils.SafeStringsEqual(f.Icon, other.Icon)
}
